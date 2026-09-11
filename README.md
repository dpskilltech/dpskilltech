# DP Skilltech — Premier IT Training & Virtual Coding Academy

> **Learn by building, not by memorizing.**  
> DP Skilltech is a next-generation IT training academy platform featuring strict 15-student cohort caps, live Zoom classes, browser-based coding labs, 1-on-1 private mock interview rubrics, and automated role-based access control.

---

## 🌟 Academy Highlights & Core Values

- **Strict 15-Student Batch Cap**: Every live cohort enforces a hard 15-student limit to guarantee personalized instructor attention, daily code reviews, and live Q&A.
- **Truthful Placement & Reviews Policy**: Zero fabricated testimonials, placement statistics, or fake reviews. Verified student defense outcomes are published only with consent.
- **In-Browser Cloud Code Lab**: Multi-language interactive coding sandbox (Python, Java, C++, SQL) with real-time test case execution and output display.
- **Private 1-on-1 Mock Interviews**: Encrypted, 1-interviewer + 1-student technical evaluations with comprehensive rubric scorecards and double-booking prevention.
- **Role-Based Academy Governance**: Dedicated interfaces for Students, Teachers & Mentors, and Administrators.

---

## 🏗 Architecture & Tech Stack

```
dpskilltech/
├── apps/
│   ├── api/             # Node.js / Express / TypeScript Backend API
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middleware/
│   │   │   ├── routes/
│   │   │   └── data/
│   └── web/             # React 18 / TypeScript / Vite Modern Frontend
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── data/
│       │   ├── pages/
│       │   │   ├── public/
│       │   │   ├── student/
│       │   │   ├── teacher/
│       │   │   └── admin/
│       │   └── services/
├── docs/                # Architecture, requirements & status logs
└── package.json         # Turborepo / NPM Workspaces root
```

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS Design System (Blue · Orange · White high-contrast palette), Lucide Icons.
- **Backend API**: Node.js, Express, TypeScript, JWT Authentication, RBAC Middleware.
- **Tools**: NPM Workspaces, ESLint, TypeScript compiler.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or later
- **NPM**: v9.0.0 or later
- **Git**: Installed and configured

### 2. Installation
Clone the repository and install all workspace dependencies:
```bash
git clone https://github.com/dpskilltech/dpskilltech.git
cd dpskilltech
npm install
```

### 3. Environment Configuration
Configure backend environment variables in `apps/api/.env`:
```bash
cp apps/api/.env.example apps/api/.env
```

### 4. Running the Development Servers

Run both the API server and the frontend client concurrently:
```bash
# Terminal 1 - Backend API (Port 5000)
npm run dev:api

# Terminal 2 - Frontend Web Client (Port 5173)
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔐 Demo Credentials for Evaluation

For rapid local testing across roles, use the **Quick Fill** chips on the [Virtual Academy Login Portal](http://localhost:5173/#login):

| Role | Email | Password |
|------|-------|----------|
| **Student** | `student@dpskilltech.com` | `password123` |
| **Teacher** | `instructor@dpskilltech.com` | `password123` |
| **Admin** | `admin@dpskilltech.com` | `password123` |

---

## 📜 Development Rules & Integrity Policy

See `PROJECT_REQUIREMENTS.md` and `docs/DEVELOPMENT_STATUS.md` for platform requirements and development milestones.

---

## 📄 License

Proprietary © 2026 DP Skilltech. All rights reserved.
