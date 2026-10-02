<<<<<<< HEAD
# HireLane — Track. Prepare. Get Hired.

> A modern, pixel-perfect job application and interview tracker built with Next.js (App Router), TypeScript, Tailwind CSS, Supabase PostgreSQL & Auth, and Resend for real transactional email reminders.

---

## 🌟 Key Features

1. **Authentication Hub:**
   - Supabase Auth integration (Email & Password, Google OAuth, Remember Me).
   - Forgot Password & Reset Password flows.
   - Clean route protection via Next.js Middleware.

2. **Dashboard:**
   - 4 Dynamic Statistics Cards (Total Applications, Interviews, Deadlines, Active Applications) calculated in real time.
   - Recent Applications table with status badges and countdown indicators.
   - Upcoming Interviews and Upcoming Deadlines side cards.
   - 4-Tile Quick Actions bar (Add Application, Add Interview, Upload Resume, Add Note).
   - Full support for both **Populated** and **Empty** onboarding states.

3. **Applications Hub:**
   - Multi-status filter tabs (`All`, `Applied`, `Assessment`, `Interviewing`, `Offer`, `Rejected`).
   - Real-time search across company name, role, and location.
   - Full CRUD operations with detailed view, editing, and safe deletion.
   - **Smart Job-Description Auto-Fill:** When pasting a complete job description into the notes, HireLane automatically extracts the Company Name, Role, Location, Job Type, Experience Level, and Links—without overwriting any manual inputs.
   - Real pagination.

4. **Interviews Hub:**
   - Master-Detail responsive split interface.
   - Left list with filter tabs (`All Interviews`, `Upcoming`) and search.
   - Detail panel with tabbed sections: Overview, Preparation Notes, Questions Asked, Feedback, and Milestone Stepper Timeline.
   - Add/Edit Interview modal with interviewer chips, date/time pickers, and reminder offsets.

5. **Profile & Resume Library:**
   - Personal Information, Academic Details, and Career Preferences cards.
   - **Resume Library:** Multiple resume uploads with file size validation, default selection, and private Supabase storage.
   - Profile photo upload and replacement.
   - Quick links for Password Change, Notification Preferences, Data Export, and Account Deletion.

6. **Real Email Reminders Engine:**
   - Transactional email delivery powered by **Resend**.
   - Application deadline alerts (7 days, 3 days, 1 day, on deadline).
   - Interview reminder emails prior to scheduled rounds with meeting links.
   - `/api/cron/process-reminders` scheduled endpoint with duplicate email prevention.

---

## 🛠 Tech Stack

- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Styling:** Tailwind CSS + custom design tokens matching the HireLane Figma specification
- **Icons:** Lucide React & Official HireLane brand mark
- **Backend & Database:** Supabase (PostgreSQL, Row Level Security, Auth, Storage)
- **Transactional Email:** Resend API
- **NLP / Smart Parser:** Heuristic regex parser with optional OpenAI enrichment

---

## 📂 Project Structure

```
HireLane/
├── public/
│   ├── logo.png             # Official HireLane brand logo
│   └── images/              # Hero card photographs
├── supabase/
│   ├── migrations/
│   │   └── 001_hirelane_schema.sql  # Database schema, RLS, triggers, storage
│   └── seed.sql                     # Development seed data matching Figma demo
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Dashboard
│   │   ├── login/page.tsx           # Login
│   │   ├── signup/page.tsx          # Signup
│   │   ├── forgot-password/page.tsx # Forgot Password
│   │   ├── reset-password/page.tsx  # Reset Password
│   │   ├── applications/page.tsx    # Applications table & empty state
│   │   ├── interviews/page.tsx      # Interviews master-detail & empty state
│   │   ├── profile/page.tsx         # Profile & Resume Library
│   │   └── api/
│   │       ├── auth/callback/route.ts
│   │       ├── extract-job/route.ts
│   │       └── cron/process-reminders/route.ts
│   ├── components/
│   │   ├── layout/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── applications/
│   │   ├── interviews/
│   │   ├── profile/
│   │   └── ui/
│   ├── lib/
│   │   ├── supabase/
│   │   ├── email/
│   │   └── parser/
│   ├── services/
│   └── types/
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Installation

```bash
cd HireLane
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials:

```ini
# Supabase (From Project Settings -> API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend Email Provider
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=HireLane <reminders@yourdomain.com>

# Scheduler Key
CRON_SECRET=hirelane_cron_secret_12345
```

> **Note:** The project runs out-of-the-box in local development with default mock states if credentials have not been configured yet.

### 3. Running Database Migrations (Supabase)

1. Open your Supabase Dashboard: **SQL Editor**.
2. Copy and paste the contents of `supabase/migrations/001_hirelane_schema.sql`.
3. Click **Run**. This will create:
   - All tables (`profiles`, `applications`, `interviews`, `resumes`, `reminders`, etc.)
   - Row Level Security (RLS) policies
   - Auto-provisioning triggers on signup
   - Private storage buckets (`resumes`, `avatars`)
4. *(Optional)* Run `supabase/seed.sql` to populate sample applications and interviews matching the Figma preview.

### 4. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⏰ Real Email Reminders & Scheduler

Reminders are stored in the `reminders` table and sent via `/api/cron/process-reminders`.

To trigger the reminder runner automatically:
- **Vercel Cron:** Add a cron job in `vercel.json` pointing to `/api/cron/process-reminders`.
- **GitHub Actions / External Cron:** Set up a curl schedule:
  ```bash
  curl -X POST https://your-domain.com/api/cron/process-reminders \
       -H "Authorization: Bearer your_cron_secret"
  ```

---

## 🔒 Security & Privacy

- **Row Level Security (RLS):** Every user can only read, insert, update, and delete their own applications, interviews, resumes, and profiles.
- **Private Storage:** Resume documents are private; files can only be accessed by the user who uploaded them.
- **Server-Side API Keys:** Email provider and Supabase service keys are never exposed to the client.
=======
# hirelane-new
>>>>>>> cff6c7e8e2b1322f36f11a736dccb03abe39ec79
