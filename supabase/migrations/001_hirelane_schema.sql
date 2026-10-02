-- ==============================================================================
-- HireLane Database Schema & Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. Profiles Table
-- ------------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  phone text,
  location text,
  linkedin_url text,
  avatar_url text,
  college text,
  degree text,
  graduation_year text,
  cgpa text,
  preferred_roles text[] default '{}',
  preferred_locations text[] default '{}',
  work_authorization text default 'Indian Citizen',
  experience_level text default 'Fresher',
  preferred_industries text[] default '{}',
  preferred_company_size text,
  notice_period text default 'Immediate',
  bio text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can delete their own profile"
  on public.profiles for delete
  using (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. Resumes Table
-- ------------------------------------------------------------------------------
create table if not exists public.resumes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  file_name text not null,
  file_url text not null,
  file_size integer not null default 0,
  mime_type text default 'application/pdf',
  is_default boolean default false,
  uploaded_at timestamptz default now()
);

alter table public.resumes enable row level security;

create policy "Users can view their own resumes"
  on public.resumes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own resumes"
  on public.resumes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own resumes"
  on public.resumes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own resumes"
  on public.resumes for delete
  using (auth.uid() = user_id);

create index if not exists idx_resumes_user_id on public.resumes(user_id);

-- ------------------------------------------------------------------------------
-- 3. Applications Table
-- ------------------------------------------------------------------------------
create table if not exists public.applications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  company_name text not null,
  role text not null,
  status text not null default 'Applied' check (status in ('Applied', 'Assessment', 'Interviewing', 'Offer', 'Rejected')),
  location text,
  job_type text,
  experience_level text,
  job_description text,
  applied_date date not null default current_date,
  deadline date,
  application_source text,
  referral text,
  job_posting_link text,
  resume_id uuid references public.resumes(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.applications enable row level security;

create policy "Users can view their own applications"
  on public.applications for select
  using (auth.uid() = user_id);

create policy "Users can insert their own applications"
  on public.applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own applications"
  on public.applications for update
  using (auth.uid() = user_id);

create policy "Users can delete their own applications"
  on public.applications for delete
  using (auth.uid() = user_id);

create index if not exists idx_applications_user_id on public.applications(user_id);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_deadline on public.applications(deadline);

-- ------------------------------------------------------------------------------
-- 4. Interviews Table
-- ------------------------------------------------------------------------------
create table if not exists public.interviews (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  application_id uuid references public.applications(id) on delete cascade not null,
  round_title text not null,
  interviewers text[] default '{}',
  interview_date date not null,
  interview_time text not null,
  duration_minutes integer default 60,
  mode text not null default 'Virtual (Google Meet)',
  meeting_link text,
  venue text,
  description text,
  resume_id uuid references public.resumes(id) on delete set null,
  preparation_notes text,
  reminder_offset text default '30 minutes before',
  outcome text default 'Pending',
  status text default 'Upcoming' check (status in ('Upcoming', 'Scheduled', 'Completed', 'Cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.interviews enable row level security;

create policy "Users can view their own interviews"
  on public.interviews for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interviews"
  on public.interviews for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interviews"
  on public.interviews for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interviews"
  on public.interviews for delete
  using (auth.uid() = user_id);

create index if not exists idx_interviews_user_id on public.interviews(user_id);
create index if not exists idx_interviews_app_id on public.interviews(application_id);
create index if not exists idx_interviews_date on public.interviews(interview_date);

-- ------------------------------------------------------------------------------
-- 5. Interview Questions Table
-- ------------------------------------------------------------------------------
create table if not exists public.interview_questions (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  question text not null,
  created_at timestamptz default now()
);

alter table public.interview_questions enable row level security;

create policy "Users can view their own interview questions"
  on public.interview_questions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interview questions"
  on public.interview_questions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interview questions"
  on public.interview_questions for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interview questions"
  on public.interview_questions for delete
  using (auth.uid() = user_id);

create index if not exists idx_interview_questions_int_id on public.interview_questions(interview_id);

-- ------------------------------------------------------------------------------
-- 6. Interview Feedback Table
-- ------------------------------------------------------------------------------
create table if not exists public.interview_feedback (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  feedback_text text not null,
  rating integer,
  created_at timestamptz default now()
);

alter table public.interview_feedback enable row level security;

create policy "Users can view their own interview feedback"
  on public.interview_feedback for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interview feedback"
  on public.interview_feedback for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interview feedback"
  on public.interview_feedback for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interview feedback"
  on public.interview_feedback for delete
  using (auth.uid() = user_id);

create index if not exists idx_interview_feedback_int_id on public.interview_feedback(interview_id);

-- ------------------------------------------------------------------------------
-- 7. Interview Timeline Table
-- ------------------------------------------------------------------------------
create table if not exists public.interview_timeline (
  id uuid default gen_random_uuid() primary key,
  interview_id uuid references public.interviews(id) on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  stage_name text not null,
  stage_date text,
  completed boolean default false,
  is_current boolean default false,
  sort_order integer default 0,
  created_at timestamptz default now()
);

alter table public.interview_timeline enable row level security;

create policy "Users can view their own interview timeline"
  on public.interview_timeline for select
  using (auth.uid() = user_id);

create policy "Users can insert their own interview timeline"
  on public.interview_timeline for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own interview timeline"
  on public.interview_timeline for update
  using (auth.uid() = user_id);

create policy "Users can delete their own interview timeline"
  on public.interview_timeline for delete
  using (auth.uid() = user_id);

create index if not exists idx_interview_timeline_int_id on public.interview_timeline(interview_id);

-- ------------------------------------------------------------------------------
-- 8. Notification Preferences Table
-- ------------------------------------------------------------------------------
create table if not exists public.notification_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  email_deadline_reminders boolean default true,
  email_interview_reminders boolean default true,
  deadline_7_days boolean default true,
  deadline_3_days boolean default true,
  deadline_1_day boolean default true,
  deadline_on_day boolean default true,
  interview_reminder_offsets text[] default array['30 minutes before'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.notification_preferences enable row level security;

create policy "Users can view their own notification preferences"
  on public.notification_preferences for select
  using (auth.uid() = user_id);

create policy "Users can insert their own notification preferences"
  on public.notification_preferences for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own notification preferences"
  on public.notification_preferences for update
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 9. Reminders Table
-- ------------------------------------------------------------------------------
create table if not exists public.reminders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  reminder_type text not null check (reminder_type in ('deadline', 'interview')),
  application_id uuid references public.applications(id) on delete cascade,
  interview_id uuid references public.interviews(id) on delete cascade,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'sent', 'cancelled', 'failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reminders enable row level security;

create policy "Users can view their own reminders"
  on public.reminders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own reminders"
  on public.reminders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own reminders"
  on public.reminders for update
  using (auth.uid() = user_id);

create policy "Users can delete their own reminders"
  on public.reminders for delete
  using (auth.uid() = user_id);

create index if not exists idx_reminders_status_scheduled on public.reminders(status, scheduled_for);
create index if not exists idx_reminders_app_id on public.reminders(application_id);
create index if not exists idx_reminders_int_id on public.reminders(interview_id);

-- ------------------------------------------------------------------------------
-- 10. Automated Profile & Notification Preferences Creation on Signup
-- ------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;

  insert into public.notification_preferences (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 11. Storage Buckets (Resumes & Avatars)
-- ------------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values 
  ('resumes', 'resumes', false),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Storage Policies for Resumes (Private: User-scoped)
create policy "Users can upload their own resumes"
  on storage.objects for insert
  with check (
    bucket_id = 'resumes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can view their own resumes"
  on storage.objects for select
  using (
    bucket_id = 'resumes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own resumes"
  on storage.objects for update
  using (
    bucket_id = 'resumes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own resumes"
  on storage.objects for delete
  using (
    bucket_id = 'resumes' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage Policies for Avatars (Public Read, Owner Write)
create policy "Anyone can view avatars"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
