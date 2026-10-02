-- ==============================================================================
-- HireLane Development Seed Data
-- ==============================================================================
-- Note: Replace '00000000-0000-0000-0000-000000000000' with your authenticated user's ID

do $$
declare
  demo_user_id uuid;
  resume1_id uuid := gen_random_uuid();
  resume2_id uuid := gen_random_uuid();
  resume3_id uuid := gen_random_uuid();
  resume4_id uuid := gen_random_uuid();
  app1_id uuid := gen_random_uuid();
  app2_id uuid := gen_random_uuid();
  app3_id uuid := gen_random_uuid();
  app4_id uuid := gen_random_uuid();
  app5_id uuid := gen_random_uuid();
  app6_id uuid := gen_random_uuid();
  app7_id uuid := gen_random_uuid();
  app8_id uuid := gen_random_uuid();
  int1_id uuid := gen_random_uuid();
  int2_id uuid := gen_random_uuid();
  int3_id uuid := gen_random_uuid();
  int4_id uuid := gen_random_uuid();
  int5_id uuid := gen_random_uuid();
begin
  -- Try to pick the first user in auth.users if available, otherwise use a placeholder
  select id into demo_user_id from auth.users order by created_at desc limit 1;
  
  if demo_user_id is not null then
    -- Profile
    insert into public.profiles (
      id, full_name, email, phone, location, linkedin_url, college, degree, graduation_year, cgpa,
      preferred_roles, preferred_locations, work_authorization, experience_level, preferred_industries,
      preferred_company_size, notice_period, bio
    ) values (
      demo_user_id,
      'Aditya Verma',
      'aditya@example.com',
      '+91 98765 43210',
      'Bangalore, India',
      'linkedin.com/in/aditya-verma',
      'IIT Bangalore',
      'B.Tech in Computer Science',
      '2025',
      '8.74 / 10.0',
      array['SDE', 'Frontend Developer', 'Full Stack Developer', 'Backend Developer', 'Software Engineer'],
      array['Bangalore', 'Hyderabad', 'Remote', 'Pune'],
      'Indian Citizen',
      'Fresher',
      array['Technology', 'Product', 'Fintech'],
      '500+ employees',
      'Immediate',
      'Passionate about building scalable web applications and solving real-world problems.'
    ) on conflict (id) do update set
      full_name = excluded.full_name,
      college = excluded.college,
      degree = excluded.degree,
      cgpa = excluded.cgpa;

    -- Resumes
    insert into public.resumes (id, user_id, file_name, file_url, file_size, mime_type, is_default, uploaded_at)
    values
      (resume1_id, demo_user_id, 'Resume_V1.pdf', 'resumes/' || demo_user_id || '/Resume_V1.pdf', 250880, 'application/pdf', true, now() - interval '25 days'),
      (resume2_id, demo_user_id, 'Resume_V2.pdf', 'resumes/' || demo_user_id || '/Resume_V2.pdf', 260096, 'application/pdf', false, now() - interval '20 days'),
      (resume3_id, demo_user_id, 'Resume_Internship.pdf', 'resumes/' || demo_user_id || '/Resume_Internship.pdf', 253952, 'application/pdf', false, now() - interval '15 days'),
      (resume4_id, demo_user_id, 'Resume_FullStack.pdf', 'resumes/' || demo_user_id || '/Resume_FullStack.pdf', 266240, 'application/pdf', false, now() - interval '10 days')
    on conflict do nothing;

    -- Applications
    insert into public.applications (id, user_id, company_name, role, status, location, applied_date, deadline, resume_id)
    values
      (app1_id, demo_user_id, 'Google', 'SDE Intern', 'Interviewing', 'Bangalore, India', '2024-05-20', '2024-05-22', resume1_id),
      (app2_id, demo_user_id, 'Amazon', 'Frontend Intern', 'Assessment', 'Hyderabad, India', '2024-05-18', '2024-05-26', resume1_id),
      (app3_id, demo_user_id, 'Microsoft', 'SWE Intern', 'Interviewing', 'Noida, India', '2024-05-15', '2024-05-24', resume1_id),
      (app4_id, demo_user_id, 'Adobe', 'Web Developer Intern', 'Applied', 'Bangalore, India', '2024-05-14', '2024-05-30', resume1_id),
      (app5_id, demo_user_id, 'Netflix', 'Software Engineer Intern', 'Applied', 'Mumbai, India', '2024-05-10', '2024-05-31', resume1_id),
      (app6_id, demo_user_id, 'Samsung', 'Research Intern', 'Applied', 'Bangalore, India', '2024-05-12', '2024-05-28', resume1_id),
      (app7_id, demo_user_id, 'Flipkart', 'SDE Intern', 'Rejected', 'Bangalore, India', '2024-05-05', '2024-05-15', resume1_id),
      (app8_id, demo_user_id, 'JP Morgan', 'Software Engineer Intern', 'Offer', 'Mumbai, India', '2024-05-02', null, resume1_id)
    on conflict do nothing;

    -- Interviews
    insert into public.interviews (
      id, user_id, application_id, round_title, interviewers, interview_date, interview_time,
      duration_minutes, mode, meeting_link, preparation_notes, reminder_offset, outcome, status, resume_id
    ) values
      (int1_id, demo_user_id, app2_id, 'Technical Round', array['John Doe'], '2024-05-22', '10:00 AM', 60, 'Virtual (Google Meet)', 'meet.google.com/abc-defg-hij', 'Revise DSA concepts; Practice system design basics; Review my resume and projects; Solve 2-3 LeetCode medium problems', '30 minutes before', 'Pending', 'Upcoming', resume1_id),
      (int2_id, demo_user_id, app3_id, 'HR Round', array['Sarah Jenkins'], '2024-05-25', '2:00 PM', 45, 'Virtual (Microsoft Teams)', 'teams.microsoft.com/meeting-123', 'Review behavioral questions; STAR method stories', '30 minutes before', 'Pending', 'Upcoming', resume1_id),
      (int3_id, demo_user_id, app1_id, 'Technical Round 2', array['Alex Rivera'], '2024-05-28', '11:00 AM', 60, 'Virtual (Google Meet)', 'meet.google.com/xyz-9876', 'Deep dive into concurrent data structures & graph algorithms', '1 hour before', 'Pending', 'Upcoming', resume1_id),
      (int4_id, demo_user_id, app4_id, 'Final Round', array['Director of Eng'], '2024-05-30', '3:00 PM', 45, 'Virtual (Zoom)', 'zoom.us/j/123456789', 'Portfolio walkthrough & architecture review', '1 day before', 'Pending', 'Scheduled', resume1_id),
      (int5_id, demo_user_id, app6_id, 'Managerial Round', array['VP R&D'], '2024-06-02', '4:00 PM', 45, 'Virtual (Webex)', 'webex.com/meet/rnd', 'Project alignment and research thesis presentation', '30 minutes before', 'Pending', 'Upcoming', resume1_id)
    on conflict do nothing;

    -- Questions for Interview 1
    insert into public.interview_questions (interview_id, user_id, question)
    values
      (int1_id, demo_user_id, 'Explain the difference between SQL and NoSQL.'),
      (int1_id, demo_user_id, 'How would you design a rate limiter?'),
      (int1_id, demo_user_id, 'Implement LRU Cache.')
    on conflict do nothing;

    -- Timeline for Interview 1
    insert into public.interview_timeline (interview_id, user_id, stage_name, stage_date, completed, is_current, sort_order)
    values
      (int1_id, demo_user_id, 'Applied', '18 May 2024', true, false, 1),
      (int1_id, demo_user_id, 'Screening', '19 May 2024', true, false, 2),
      (int1_id, demo_user_id, 'Technical Round', '22 May 2024', false, true, 3),
      (int1_id, demo_user_id, 'HR Round', '--', false, false, 4)
    on conflict do nothing;

  end if;
end $$;
