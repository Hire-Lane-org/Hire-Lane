import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export const reminderService = {
  async scheduleDeadlineReminders(
    userId: string,
    applicationId: string,
    deadlineDate: string | null
  ) {
    if (!deadlineDate) return;

    if (!isSupabaseConfigured()) {
      console.log("[Demo Mode] Scheduled deadline reminder for", { applicationId, deadlineDate });
      return;
    }

    try {
      // 1. Cancel existing pending deadline reminders for this application
      await supabase
        .from("reminders")
        .update({ status: "cancelled" })
        .eq("application_id", applicationId)
        .eq("reminder_type", "deadline")
        .eq("status", "pending");

      const deadline = new Date(deadlineDate);
      const now = new Date();

      // Reminder intervals in days before deadline: 7 days, 3 days, 1 day, 0 days (day of)
      const intervals = [7, 3, 1, 0];

      for (const daysBefore of intervals) {
        const reminderTime = new Date(deadline);
        reminderTime.setDate(reminderTime.getDate() - daysBefore);
        reminderTime.setHours(9, 0, 0, 0); // 9:00 AM

        if (reminderTime > now) {
          await supabase.from("reminders").insert({
            user_id: userId,
            reminder_type: "deadline",
            application_id: applicationId,
            scheduled_for: reminderTime.toISOString(),
            status: "pending",
          });
        }
      }
    } catch (err) {
      console.error("[reminderService.scheduleDeadlineReminders Error]", err);
    }
  },

  async scheduleInterviewReminder(
    userId: string,
    interviewId: string,
    interviewDate: string,
    interviewTime: string,
    reminderOffset: string
  ) {
    if (!isSupabaseConfigured()) {
      console.log("[Demo Mode] Scheduled interview reminder for", { interviewId, interviewDate, interviewTime });
      return;
    }

    try {
      // 1. Cancel existing pending interview reminders
      await supabase
        .from("reminders")
        .update({ status: "cancelled" })
        .eq("interview_id", interviewId)
        .eq("reminder_type", "interview")
        .eq("status", "pending");

      // Parse date & time (e.g. "2024-05-22" and "10:00 AM")
      const parsedDateTime = new Date(`${interviewDate} ${interviewTime}`);
      if (isNaN(parsedDateTime.getTime())) return;

      const reminderTime = new Date(parsedDateTime);

      if (reminderOffset.includes("15 minutes")) {
        reminderTime.setMinutes(reminderTime.getMinutes() - 15);
      } else if (reminderOffset.includes("30 minutes")) {
        reminderTime.setMinutes(reminderTime.getMinutes() - 30);
      } else if (reminderOffset.includes("1 hour")) {
        reminderTime.setHours(reminderTime.getHours() - 1);
      } else if (reminderOffset.includes("1 day")) {
        reminderTime.setDate(reminderTime.getDate() - 1);
      }

      if (reminderTime > new Date()) {
        await supabase.from("reminders").insert({
          user_id: userId,
          reminder_type: "interview",
          interview_id: interviewId,
          scheduled_for: reminderTime.toISOString(),
          status: "pending",
        });
      }
    } catch (err) {
      console.error("[reminderService.scheduleInterviewReminder Error]", err);
    }
  },

  async cancelRemindersForApplication(applicationId: string) {
    if (!isSupabaseConfigured()) return;
    await supabase
      .from("reminders")
      .update({ status: "cancelled" })
      .eq("application_id", applicationId)
      .eq("status", "pending");
  },

  async cancelRemindersForInterview(interviewId: string) {
    if (!isSupabaseConfigured()) return;
    await supabase
      .from("reminders")
      .update({ status: "cancelled" })
      .eq("interview_id", interviewId)
      .eq("status", "pending");
  },
};
