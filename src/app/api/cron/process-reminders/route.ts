import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/resend";
import { generateDeadlineEmailHtml } from "@/lib/email/templates/deadlineReminder";
import { generateInterviewEmailHtml } from "@/lib/email/templates/interviewReminder";
import { getDeadlineCountdown, formatDate } from "@/lib/utils";

// Server-side privileged client using SERVICE_ROLE_KEY or ANON_KEY for background cron
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export async function GET(req: NextRequest) {
  return handleReminderProcessing(req);
}

export async function POST(req: NextRequest) {
  return handleReminderProcessing(req);
}

async function handleReminderProcessing(req: NextRequest) {
  try {
    // 1. Authorization check
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    const urlSecret = req.nextUrl.searchParams.get("secret");

    if (cronSecret && cronSecret !== "hirelane_dev_cron_secret") {
      const isHeaderValid = authHeader === `Bearer ${cronSecret}`;
      const isQueryValid = urlSecret === cronSecret;
      if (!isHeaderValid && !isQueryValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    if (!supabaseUrl || !serviceRoleKey || supabaseUrl.includes("placeholder")) {
      return NextResponse.json({
        message: "Supabase not configured. Reminders simulated in development mode.",
        processed: 0,
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    // 2. Fetch pending reminders scheduled for now or in the past
    const now = new Date().toISOString();
    const { data: pendingReminders, error } = await supabaseAdmin
      .from("reminders")
      .select(`
        id,
        user_id,
        reminder_type,
        application_id,
        interview_id,
        scheduled_for,
        status,
        applications (
          company_name,
          role,
          deadline,
          job_posting_link
        ),
        interviews (
          round_title,
          interview_date,
          interview_time,
          mode,
          meeting_link,
          venue,
          interviewers,
          applications (
            company_name
          )
        )
      `)
      .eq("status", "pending")
      .lte("scheduled_for", now)
      .limit(50);

    if (error) {
      console.error("[Cron Reminders Error]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!pendingReminders || pendingReminders.length === 0) {
      return NextResponse.json({ message: "No pending reminders to process", processed: 0 });
    }

    const results = [];

    for (const reminder of pendingReminders) {
      try {
        // 3. Check user's notification preferences
        const { data: pref } = await supabaseAdmin
          .from("notification_preferences")
          .select("*")
          .eq("user_id", reminder.user_id)
          .single();

        // 4. Fetch user email & profile
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("full_name, email")
          .eq("id", reminder.user_id)
          .single();

        const userEmail = profile?.email;
        const userName = profile?.full_name || "HireLane User";

        if (!userEmail) {
          await supabaseAdmin
            .from("reminders")
            .update({ status: "failed", error_message: "User email not found" })
            .eq("id", reminder.id);
          continue;
        }

        // Process Deadline Reminders
        if (reminder.reminder_type === "deadline") {
          if (pref && !pref.email_deadline_reminders) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "cancelled", error_message: "User opted out of deadline reminders" })
              .eq("id", reminder.id);
            continue;
          }

          const app = reminder.applications as any;
          if (!app) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "cancelled", error_message: "Application deleted" })
              .eq("id", reminder.id);
            continue;
          }

          const countdown = getDeadlineCountdown(app.deadline);
          const emailHtml = generateDeadlineEmailHtml({
            userName,
            companyName: app.company_name,
            role: app.role,
            deadlineDate: formatDate(app.deadline),
            daysRemaining: countdown.text,
            jobPostingLink: app.job_posting_link,
          });

          const sendResult = await sendEmail({
            to: userEmail,
            subject: `⏰ Deadline Alert: ${app.company_name} (${app.role}) - ${countdown.text}`,
            html: emailHtml,
          });

          if (sendResult.success) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "sent", sent_at: new Date().toISOString() })
              .eq("id", reminder.id);
            results.push({ id: reminder.id, status: "sent", to: userEmail });
          } else {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "failed", error_message: sendResult.error })
              .eq("id", reminder.id);
            results.push({ id: reminder.id, status: "failed", error: sendResult.error });
          }
        }
        // Process Interview Reminders
        else if (reminder.reminder_type === "interview") {
          if (pref && !pref.email_interview_reminders) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "cancelled", error_message: "User opted out of interview reminders" })
              .eq("id", reminder.id);
            continue;
          }

          const interview = reminder.interviews as any;
          if (!interview) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "cancelled", error_message: "Interview deleted" })
              .eq("id", reminder.id);
            continue;
          }

          const compName = interview.applications?.company_name || "Upcoming";
          const emailHtml = generateInterviewEmailHtml({
            userName,
            companyName: compName,
            roundTitle: interview.round_title,
            interviewDate: formatDate(interview.interview_date),
            interviewTime: interview.interview_time,
            mode: interview.mode,
            meetingLink: interview.meeting_link,
            venue: interview.venue,
            interviewers: interview.interviewers || [],
          });

          const sendResult = await sendEmail({
            to: userEmail,
            subject: `🎯 Interview Reminder: ${compName} - ${interview.round_title}`,
            html: emailHtml,
          });

          if (sendResult.success) {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "sent", sent_at: new Date().toISOString() })
              .eq("id", reminder.id);
            results.push({ id: reminder.id, status: "sent", to: userEmail });
          } else {
            await supabaseAdmin
              .from("reminders")
              .update({ status: "failed", error_message: sendResult.error })
              .eq("id", reminder.id);
            results.push({ id: reminder.id, status: "failed", error: sendResult.error });
          }
        }
      } catch (err: any) {
        console.error(`[Error processing reminder ${reminder.id}]`, err);
        await supabaseAdmin
          .from("reminders")
          .update({ status: "failed", error_message: err.message })
          .eq("id", reminder.id);
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error: any) {
    console.error("[Reminders Cron Fatal Error]", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
