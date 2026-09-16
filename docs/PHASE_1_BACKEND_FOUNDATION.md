# DP Skill Tech Academy — Phase 1: Foundation, Database, Authentication & Security

Comprehensive architectural specification for the backend foundation of the **DP Skill Tech Technology Academy** (https://www.dpskilltech.in/).

---

## 1. Architectural Overview

* **Frontend**: React 19 + TypeScript 6 + Vite 8 monorepo (`apps/web`).
* **Hosting**: Vercel.
* **Backend Database & Auth**: PostgreSQL managed via **Supabase** as the **Single Source of Truth** (legacy Prisma layer deprecated).
* **Access Control**: PostgreSQL Row Level Security (RLS) + Custom Role-Based Access Control (RBAC).
* **Storage Abstraction**: Decoupled `StorageService` interface; metadata in PostgreSQL, architected for **Cloudflare R2** (documents, zero egress fees) and **Cloudflare Stream** (video streaming, 500+ hrs/mo).
* **Batch Capacity**: Fully configurable by Admin or nullable/unlimited (`max_capacity INTEGER NULL`).
* **Sequential Learning**: `course_progress` and `lesson_completions` tables provide the foundation for sequential prerequisite progression.
* **Certificate Reissue History**: Multi-version certificate lineage with replacement and revocation audit chains.
* **Production Guard**: Fail-safe production checks prevent fallback mock data from ever executing in production.
* **Payment Architecture**: UPI ONLY (`fee_plans`, `installments`, `payments`).
* **Auditing**: Immutable `audit_logs` with actor, action, previous/new value, and device metadata.

---

## 2. Environment Variables

### `apps/web/.env` (Client)
| Variable | Description | Exposure |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Backend Express API endpoint (default: `http://localhost:5000/api`) | Public |
| `VITE_SUPABASE_URL` | Supabase project API gateway | Public |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous public client key | Public (Safe with RLS) |

### `apps/api/.env` (Server-Side Only — NEVER Expose to Browser)
| Variable | Description |
| :--- | :--- |
| `PORT` | API server port (default: `5000`) |
| `SUPABASE_URL` | Supabase project API gateway |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role secret key (bypasses RLS for admin provisioning) |
| `JWT_SECRET` | Secret key for legacy fallback token signing in development |
| `UPI_ID` | Official academy UPI ID for fee collection (e.g. `dpskilltech@upi`) |

---

## 3. Database Migrations & Schema Dictionary

All schema definitions use **UUID primary keys** (`gen_random_uuid()`), deterministic timestamps (`created_at`, `updated_at`), foreign keys, and status enums.

### Migration Files
1. [`supabase/migrations/20260913000001_phase1_schema.sql`](file:///d:/projects/DPskilltech/supabase/migrations/20260913000001_phase1_schema.sql)
   * 26 normalized PostgreSQL tables.
   * Domain enums for statuses, payment methods, delivery channels, and access levels.
   * Automated `updated_at` triggers and performance indexes for scale (1,000+ students).
2. [`supabase/migrations/20260913000002_phase1_rbac_rls.sql`](file:///d:/projects/DPskilltech/supabase/migrations/20260913000002_phase1_rbac_rls.sql)
   * Database security helper functions (`is_super_admin()`, `is_admin()`, `is_teacher()`, `is_student()`, `is_parent()`, `has_permission(code)`).
   * RLS enabled on all tables with strict multi-tenant isolation.
3. [`supabase/migrations/20260913000003_phase1_dev_seed.sql`](file:///d:/projects/DPskilltech/supabase/migrations/20260913000003_phase1_dev_seed.sql)
   * 5 base system roles (`SUPER_ADMIN`, `ADMIN`, `TEACHER`, `STUDENT`, `PARENT`).
   * 24 granular permissions.
   * Public course catalog fixture seed (zero fake students or testimonials).

### Core Tables Summary
| Table | Key Responsibilities |
| :--- | :--- |
| `profiles` | Decoupled user identity linked to `auth.users(id)` with status and password change flags. |
| `roles` & `permissions` | Custom RBAC catalog supporting Super Admin custom role creation. |
| `student_profiles` | Unique student ID (`DPSK-STU-YYYY-XXXX`), status (`ACTIVE`, `SUSPENDED`, `ARCHIVED`). |
| `parent_profiles` & `parent_students` | Optional parent linkage to 1+ students with strict private encapsulation. |
| `teacher_profiles` | Faculty roster, bio, expertise, status (`ACTIVE`, `DISABLED`). |
| `courses` | Catalog tracks with status (`DRAFT`, `PUBLISHED`, `ARCHIVED`), duration, and level. |
| `modules` & `lessons` | Deterministic ordering (`order_index`), prerequisite modules, video references. |
| `course_progress` | Progression engine state tracking completed count, percentage, and current lesson. |
| `lesson_completions` | Immutable per-lesson completion records with time spent. |
| `batches` | Cohorts with Admin-configurable capacity (`max_capacity INT DEFAULT NULL`). |
| `recurring_schedules` | Monday–Saturday daily class schedules (days 1–6). Sunday is a holiday. |
| `schedule_overrides` | Single-session rescheduling or cancellations without breaking recurring rules. |
| `fee_plans` & `installments` | Full payment vs multi-part EMI payment plans. |
| `enrollments` | Student enrollment state machine (`INQUIRY` → `PAYMENT_VERIFIED` → `ACTIVE` → `COMPLETED`). |
| `payments` | UPI transaction records with UTR number and screenshot references. |
| `demo_bookings` | Course-specific demo reservations with status tracking. |
| `general_inquiries` | Public website inquiries distinct from formal course enrollments. |
| `certificates` | Digitally verifiable credentials with full reissue/replacement history (`version`, `is_latest`, `superseded_by`). |
| `notifications` | Multi-channel alerts (`IN_APP`, `EMAIL`). |
| `audit_logs` | Immutable audit trail; no `UPDATE` or `DELETE` policies permitted. |
| `file_assets` | Storage abstraction metadata table for Cloudflare R2 / Stream readiness. |

---

## 4. Authentication & Security Architecture

### A. Supported Authentication Methods
* **Email + Password**: Supported via Supabase Auth.
* **Phone + Password**: Supported via Supabase Auth phone provider.

### B. Student Onboarding Workflow (Rule 5: No Self-Registration)
1. **Account Provisioning**: Admin provisions student account via `POST /api/admin/auth/students` using Supabase service-role credentials.
2. **Temporary Credentials**: System generates a 12-character high-entropy temporary password and sets `requires_password_change: true`.
3. **First Sign-In**: Student authenticates with temporary credentials.
4. **Mandatory Password Change**: Client prompts student to choose a private password using `changePassword()`. Once changed, `requires_password_change` flips to `false`.

### C. Admin-Only Student Password Reset
* Students cannot self-reset passwords.
* Admin triggers `POST /api/admin/auth/students/reset-password`.
* Plaintext passwords are never stored in databases or shown in logs. Supabase Auth securely manages the cryptographic update.
* Action is logged in `audit_logs`.

### D. Super Admin MFA
* TOTP-based Multi-Factor Authentication via Supabase Auth MFA APIs.
* Enforces two-step verification for all Super Admin governance tasks.

---

## 5. Storage Abstraction Layer

The application avoids hardcoding Supabase Storage directly in application components:
```typescript
interface IStorageService {
  uploadFile(options: UploadOptions): Promise<FileAssetMetadata>;
  downloadFile(storagePath: string): Promise<Buffer>;
  deleteFile(storagePath: string): Promise<void>;
  getSignedUrl(storagePath: string, expiresInSeconds?: number): Promise<string>;
}
```
* **Development Default**: `SupabaseStorageProvider`.
* **Future Migration**: Cloudflare R2 (documents) and Cloudflare Stream (recording library) can be dropped in by implementing `StorageProvider` with zero changes to database models or controllers.

---

## 6. Verification & Route Protection

* Protected client routes:
  * `/admin` & `/admin/*` &rarr; Requires `ADMIN` or `SUPER_ADMIN`.
  * `/super-admin` & `/super-admin/*` &rarr; Requires `SUPER_ADMIN`.
  * `/teacher` & `/teacher/*` &rarr; Requires `TEACHER`, `ADMIN`, or `SUPER_ADMIN`.
  * `/student` & `/student/*` &rarr; Requires `STUDENT`.
  * `/parent` & `/parent/*` &rarr; Requires `PARENT`.
* Database-level RLS strictly blocks any unauthorized query even if client guards are bypassed.
