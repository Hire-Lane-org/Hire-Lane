export type ApplicationStatus = 'Applied' | 'Assessment' | 'Interviewing' | 'Offer' | 'Rejected';

export type JobType = 'Full-time' | 'Internship' | 'Part-time' | 'Contract' | 'Co-op';

export type ExperienceLevel = 'Fresher' | '0-1 years' | '1-3 years' | '3-5 years' | '5+ years';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  linkedin_url: string | null;
  avatar_url: string | null;
  college: string | null;
  degree: string | null;
  graduation_year: string | null;
  cgpa: string | null;
  preferred_roles: string[];
  preferred_locations: string[];
  work_authorization: string;
  experience_level: string;
  preferred_industries: string[];
  preferred_company_size: string | null;
  notice_period: string;
  bio: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Resume {
  id: string;
  user_id: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  is_default: boolean;
  uploaded_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  company_name: string;
  role: string;
  status: ApplicationStatus;
  location: string | null;
  job_type: string | null;
  experience_level: string | null;
  job_description: string | null;
  applied_date: string;
  deadline: string | null;
  application_source: string | null;
  referral: string | null;
  job_posting_link: string | null;
  resume_id: string | null;
  created_at?: string;
  updated_at?: string;
  resumes?: Resume | null;
}

export interface Interview {
  id: string;
  user_id: string;
  application_id: string;
  round_title: string;
  interviewers: string[];
  interview_date: string;
  interview_time: string;
  duration_minutes: number;
  mode: string;
  meeting_link: string | null;
  venue: string | null;
  description: string | null;
  resume_id: string | null;
  preparation_notes: string | null;
  reminder_offset: string;
  outcome: string;
  status: 'Upcoming' | 'Scheduled' | 'Completed' | 'Cancelled';
  created_at?: string;
  updated_at?: string;
  applications?: Application;
  resumes?: Resume | null;
}

export interface InterviewQuestion {
  id: string;
  interview_id: string;
  user_id: string;
  question: string;
  created_at: string;
}

export interface InterviewFeedback {
  id: string;
  interview_id: string;
  user_id: string;
  feedback_text: string;
  rating?: number | null;
  created_at: string;
}

export interface InterviewTimelineStage {
  id: string;
  interview_id: string;
  user_id: string;
  stage_name: string;
  stage_date: string | null;
  completed: boolean;
  is_current: boolean;
  sort_order: number;
  created_at?: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_deadline_reminders: boolean;
  email_interview_reminders: boolean;
  deadline_7_days: boolean;
  deadline_3_days: boolean;
  deadline_1_day: boolean;
  deadline_on_day: boolean;
  interview_reminder_offsets: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  reminder_type: 'deadline' | 'interview';
  application_id?: string | null;
  interview_id?: string | null;
  scheduled_for: string;
  status: 'pending' | 'sent' | 'cancelled' | 'failed';
  error_message?: string | null;
  sent_at?: string | null;
  created_at: string;
  updated_at: string;
}
