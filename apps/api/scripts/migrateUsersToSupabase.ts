#!/usr/bin/env ts-node
/**
 * DP SKILL TECH ACADEMY — Prisma → Supabase User Migration Script
 *
 * PURPOSE:
 *   One-time migration of local development seed accounts into Supabase Auth + profiles.
 *   This script is for DEVELOPMENT ONLY. There is no live production user data to migrate.
 *
 * WHAT IT DOES:
 *   1. Reads the pre-defined dev seed accounts (Prisma seed accounts)
 *   2. Creates corresponding Supabase Auth users via Admin API
 *   3. Inserts profiles, role-specific profile rows, and user_roles
 *   4. Sets requires_password_change = TRUE for all migrated accounts
 *
 * WHAT IT DOES NOT DO:
 *   - Never reads or stores password hashes (passwords are reset via Supabase Auth)
 *   - Never migrates to a standalone `users` table (that table does not exist in the new schema)
 *   - Never runs in production (script halts if NODE_ENV === 'production')
 *
 * MIGRATION MAPPING:
 *   OLD Prisma: User (email, passwordHash, role)
 *     → auth.users (Supabase Auth — sole credential store)
 *     → profiles (id=auth.users.id, full_name, email, requires_password_change=TRUE)
 *     → user_roles (user_id=profiles.id, role_id → roles table)
 *
 *   OLD Prisma: StudentProfile  → student_profiles (profile_id → profiles.id)
 *   OLD Prisma: TeacherProfile  → teacher_profiles (profile_id → profiles.id)
 *   OLD Prisma: AdminProfile    → user_roles (role=ADMIN/SUPER_ADMIN; no separate admin table)
 *
 * USAGE:
 *   npx ts-node apps/api/scripts/migrateUsersToSupabase.ts
 *
 * PREREQUISITES:
 *   - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in apps/api/.env
 *   - Run seed migration (20260913000004_phase1_dev_seed.sql) first to populate roles table
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// =============================================================================
// Safety checks
// =============================================================================

if (process.env.NODE_ENV === 'production') {
  console.error('❌ ABORT: This migration script must NEVER run in production.');
  console.error('   There is no live production user data to migrate.');
  process.exit(1);
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ ABORT: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in apps/api/.env');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

interface SeedUser {
  email: string;
  fullName: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'TEACHER' | 'STUDENT';
  phone?: string;
}

// Dev seed accounts from Prisma seed (no production users exist)
const DEV_SEED_ACCOUNTS: SeedUser[] = [
  { email: 'admin@dpskilltech.in',     fullName: 'DP Skilltech Admin',      role: 'SUPER_ADMIN' },
  { email: 'instructor@dpskilltech.in', fullName: 'DP Skilltech Instructor', role: 'TEACHER' },
  { email: 'student@dpskilltech.in',   fullName: 'Test Student',            role: 'STUDENT' },
];

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(12);
  for (let i = 0; i < 12; i++) {
    password += chars[randomBytes[i] % chars.length];
  }
  return password;
}

async function upsertProfile(supabaseId: string, seedUser: SeedUser): Promise<void> {
  const { error: profileError } = await supabaseAdmin.from('profiles').upsert({
    id: supabaseId,
    full_name: seedUser.fullName,
    email: seedUser.email,
    phone: seedUser.phone || null,
    status: 'ACTIVE',
    requires_password_change: true
  }, { onConflict: 'id' });

  if (profileError) {
    console.warn(`   ⚠️  Profile upsert warning: ${profileError.message}`);
  } else {
    console.log(`   ✅ Profile created/updated`);
  }

  // Assign role from roles table
  const { data: roleData } = await supabaseAdmin
    .from('roles').select('id').eq('name', seedUser.role).single();

  if (roleData) {
    await supabaseAdmin.from('user_roles').upsert(
      { user_id: supabaseId, role_id: roleData.id },
      { onConflict: 'user_id,role_id' }
    );
    console.log(`   ✅ Role assigned: ${seedUser.role}`);
  } else {
    console.warn(`   ⚠️  Role '${seedUser.role}' not in roles table — run seed SQL first`);
  }

  // Role-specific profile records
  if (seedUser.role === 'STUDENT') {
    const year = new Date().getFullYear();
    const studentIdCode = `DPSK-STU-${year}-DEV${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
    await supabaseAdmin.from('student_profiles').upsert(
      { profile_id: supabaseId, student_id: studentIdCode, status: 'ACTIVE', admin_notes: 'Dev seed account' },
      { onConflict: 'profile_id' }
    );
    console.log(`   ✅ Student profile: ${studentIdCode}`);
  } else if (seedUser.role === 'TEACHER') {
    await supabaseAdmin.from('teacher_profiles').upsert(
      { profile_id: supabaseId, bio: 'Dev seed instructor', expertise: ['Python', 'AI'], status: 'ACTIVE' },
      { onConflict: 'profile_id' }
    );
    console.log(`   ✅ Teacher profile created`);
  }
  // ADMIN/SUPER_ADMIN: role-only, no separate profile table needed
}

async function migrateUsers(): Promise<void> {
  console.log('🚀 DP Skilltech — Dev Account Migration: Prisma → Supabase Auth');
  console.log('================================================================');
  console.log(`   Target: ${SUPABASE_URL}`);
  console.log(`   Accounts: ${DEV_SEED_ACCOUNTS.length}`);
  console.log('================================================================\n');

  const results: Array<{ email: string; id: string; tempPassword: string; status: string }> = [];

  for (const seedUser of DEV_SEED_ACCOUNTS) {
    console.log(`\n⏳ ${seedUser.email} (${seedUser.role})`);
    const tempPassword = generateTemporaryPassword();

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: seedUser.email,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { full_name: seedUser.fullName, role: seedUser.role }
    });

    if (authError || !authUser?.user) {
      if (authError?.message?.includes('already been registered')) {
        // Find existing user and upsert profile
        const { data: list } = await supabaseAdmin.auth.admin.listUsers();
        const existing = list?.users?.find((u: any) => u.email === seedUser.email);
        if (existing) {
          await upsertProfile(existing.id, seedUser);
          results.push({ email: seedUser.email, id: existing.id, tempPassword: '(existing — reset manually)', status: 'EXISTING_UPDATED' });
        } else {
          console.error(`   ❌ Could not find existing user`);
        }
      } else {
        console.error(`   ❌ Auth creation failed: ${authError?.message}`);
      }
      continue;
    }

    const supabaseId = authUser.user.id;
    console.log(`   ✅ Supabase Auth user: ${supabaseId}`);
    await upsertProfile(supabaseId, seedUser);
    results.push({ email: seedUser.email, id: supabaseId, tempPassword, status: 'MIGRATED' });
  }

  console.log('\n\n================================================================');
  console.log('✅ Migration Complete');
  console.log('================================================================');
  console.log('\n📋 Temporary Credentials (all require password change on first login):\n');
  for (const r of results) {
    console.log(`   ${r.email}`);
    console.log(`     ID: ${r.id}`);
    console.log(`     Temp Password: ${r.tempPassword}`);
    console.log(`     Status: ${r.status}\n`);
  }
  console.log('⚠️  These passwords are shown ONCE. Store them securely.\n');
}

migrateUsers().catch((err) => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
