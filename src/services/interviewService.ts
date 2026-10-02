import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import {
  Interview,
  InterviewQuestion,
  InterviewFeedback,
  InterviewTimelineStage,
} from "@/types/database";
import { reminderService } from "./reminderService";

export const interviewService = {
  getLocalInterviews(userId: string): Interview[] {
    if (typeof window === "undefined") return [];
    const key = `hirelane_interviews_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  },

  setLocalInterviews(userId: string, items: Interview[]) {
    if (typeof window === "undefined") return;
    const key = `hirelane_interviews_${userId}`;
    localStorage.setItem(key, JSON.stringify(items));
  },

  async getInterviews(
    userId: string,
    filter?: { type?: string; search?: string }
  ): Promise<Interview[]> {
    const { type, search } = filter || {};

    if (!isSupabaseConfigured()) {
      let list = this.getLocalInterviews(userId);

      if (type === "Upcoming") {
        list = list.filter((i) => i.status === "Upcoming" || i.status === "Scheduled");
      }

      if (search && search.trim().length > 0) {
        const q = search.toLowerCase();
        list = list.filter(
          (i) =>
            i.round_title.toLowerCase().includes(q) ||
            i.applications?.company_name.toLowerCase().includes(q) ||
            i.applications?.role.toLowerCase().includes(q)
        );
      }

      return list;
    }

    try {
      let query = supabase
        .from("interviews")
        .select("*, applications(*), resumes(*)")
        .eq("user_id", userId)
        .order("interview_date", { ascending: true });

      if (type === "Upcoming") {
        query = query.in("status", ["Upcoming", "Scheduled"]);
      }

      const { data, error } = await query;
      if (error) throw error;

      let result = (data as Interview[]) || [];

      if (search && search.trim().length > 0) {
        const q = search.toLowerCase();
        result = result.filter(
          (i) =>
            i.round_title.toLowerCase().includes(q) ||
            i.applications?.company_name.toLowerCase().includes(q)
        );
      }

      return result;
    } catch (err) {
      console.error("[getInterviews Error]", err);
      return [];
    }
  },

  async getInterviewDetails(interviewId: string) {
    if (!isSupabaseConfigured()) {
      // Look up interview across local stores
      let interview: Interview | null = null;
      if (typeof window !== "undefined") {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith("hirelane_interviews_")) {
            try {
              const list: Interview[] = JSON.parse(localStorage.getItem(k) || "[]");
              const found = list.find((item) => item.id === interviewId);
              if (found) {
                interview = found;
                break;
              }
            } catch {}
          }
        }
      }

      let questions: InterviewQuestion[] = [];
      let feedback: InterviewFeedback[] = [];
      let timeline: InterviewTimelineStage[] = [];

      if (typeof window !== "undefined") {
        const qRaw = localStorage.getItem(`hirelane_questions_${interviewId}`);
        if (qRaw) {
          try { questions = JSON.parse(qRaw); } catch {}
        }
        const fRaw = localStorage.getItem(`hirelane_feedback_${interviewId}`);
        if (fRaw) {
          try { feedback = JSON.parse(fRaw); } catch {}
        }
        const tRaw = localStorage.getItem(`hirelane_timeline_${interviewId}`);
        if (tRaw) {
          try { timeline = JSON.parse(tRaw); } catch {}
        } else if (interview) {
          // Default minimal timeline for newly scheduled interview
          timeline = [
            {
              id: "tl-" + Date.now(),
              interview_id: interviewId,
              user_id: interview.user_id,
              stage_name: interview.round_title || "Round 1",
              stage_date: interview.interview_date,
              completed: false,
              is_current: true,
              sort_order: 1,
            },
          ];
        }
      }

      return { interview, questions, feedback, timeline };
    }

    try {
      const { data: interview } = await supabase
        .from("interviews")
        .select("*, applications(*), resumes(*)")
        .eq("id", interviewId)
        .single();

      const { data: questions } = await supabase
        .from("interview_questions")
        .select("*")
        .eq("interview_id", interviewId);

      const { data: feedback } = await supabase
        .from("interview_feedback")
        .select("*")
        .eq("interview_id", interviewId);

      const { data: timeline } = await supabase
        .from("interview_timeline")
        .select("*")
        .eq("interview_id", interviewId)
        .order("sort_order", { ascending: true });

      return {
        interview: interview as Interview,
        questions: (questions as InterviewQuestion[]) || [],
        feedback: (feedback as InterviewFeedback[]) || [],
        timeline: (timeline as InterviewTimelineStage[]) || [],
      };
    } catch (err) {
      console.error("[getInterviewDetails Error]", err);
      return { interview: null, questions: [], feedback: [], timeline: [] };
    }
  },

  async createInterview(userId: string, data: Partial<Interview>): Promise<Interview | null> {
    if (!isSupabaseConfigured()) {
      const newInt: Interview = {
        id: "int-" + Date.now(),
        user_id: userId,
        application_id: data.application_id || "",
        round_title: data.round_title || "Interview Round",
        interviewers: data.interviewers || [],
        interview_date: data.interview_date || new Date().toISOString().split("T")[0],
        interview_time: data.interview_time || "10:00 AM",
        duration_minutes: data.duration_minutes || 60,
        mode: data.mode || "Virtual (Google Meet)",
        meeting_link: data.meeting_link || null,
        venue: data.venue || null,
        description: data.description || null,
        resume_id: data.resume_id || null,
        preparation_notes: data.preparation_notes || null,
        reminder_offset: data.reminder_offset || "30 minutes before",
        outcome: data.outcome || "Pending",
        status: (data.status as any) || "Upcoming",
        applications: data.applications,
      };

      const current = this.getLocalInterviews(userId);
      this.setLocalInterviews(userId, [newInt, ...current]);

      // Initialize default timeline
      if (typeof window !== "undefined") {
        const initialTimeline: InterviewTimelineStage[] = [
          {
            id: "tl-" + Date.now(),
            interview_id: newInt.id,
            user_id: userId,
            stage_name: newInt.round_title,
            stage_date: newInt.interview_date,
            completed: false,
            is_current: true,
            sort_order: 1,
          },
        ];
        localStorage.setItem(`hirelane_timeline_${newInt.id}`, JSON.stringify(initialTimeline));
      }

      await reminderService.scheduleInterviewReminder(
        userId,
        newInt.id,
        newInt.interview_date,
        newInt.interview_time,
        newInt.reminder_offset
      );
      return newInt;
    }

    try {
      const { data: created, error } = await supabase
        .from("interviews")
        .insert({
          user_id: userId,
          application_id: data.application_id,
          round_title: data.round_title,
          interviewers: data.interviewers,
          interview_date: data.interview_date,
          interview_time: data.interview_time,
          duration_minutes: data.duration_minutes,
          mode: data.mode,
          meeting_link: data.meeting_link,
          venue: data.venue,
          description: data.description,
          resume_id: data.resume_id,
          preparation_notes: data.preparation_notes,
          reminder_offset: data.reminder_offset,
          outcome: data.outcome || "Pending",
          status: data.status || "Upcoming",
        })
        .select("*, applications(*), resumes(*)")
        .single();

      if (error) throw error;
      if (created) {
        await reminderService.scheduleInterviewReminder(
          userId,
          created.id,
          created.interview_date,
          created.interview_time,
          created.reminder_offset
        );
      }
      return created;
    } catch (err) {
      console.error("[createInterview Error]", err);
      return null;
    }
  },

  async updateInterview(
    id: string,
    userId: string,
    data: Partial<Interview>
  ): Promise<Interview | null> {
    if (!isSupabaseConfigured()) {
      const list = this.getLocalInterviews(userId);
      const idx = list.findIndex((i) => i.id === id && i.user_id === userId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        this.setLocalInterviews(userId, [...list]);
        if (data.interview_date || data.interview_time || data.reminder_offset) {
          await reminderService.scheduleInterviewReminder(
            userId,
            id,
            list[idx].interview_date,
            list[idx].interview_time,
            list[idx].reminder_offset
          );
        }
        return list[idx];
      }
      return null;
    }

    try {
      const { data: updated, error } = await supabase
        .from("interviews")
        .update({
          round_title: data.round_title,
          interviewers: data.interviewers,
          interview_date: data.interview_date,
          interview_time: data.interview_time,
          duration_minutes: data.duration_minutes,
          mode: data.mode,
          meeting_link: data.meeting_link,
          venue: data.venue,
          description: data.description,
          resume_id: data.resume_id,
          preparation_notes: data.preparation_notes,
          reminder_offset: data.reminder_offset,
          outcome: data.outcome,
          status: data.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*, applications(*), resumes(*)")
        .single();

      if (error) throw error;
      if (updated && (data.interview_date || data.interview_time || data.reminder_offset)) {
        await reminderService.scheduleInterviewReminder(
          userId,
          id,
          updated.interview_date,
          updated.interview_time,
          updated.reminder_offset
        );
      }
      return updated;
    } catch (err) {
      console.error("[updateInterview Error]", err);
      return null;
    }
  },

  async deleteInterview(id: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const list = this.getLocalInterviews(userId);
      this.setLocalInterviews(
        userId,
        list.filter((i) => i.id !== id)
      );
      if (typeof window !== "undefined") {
        localStorage.removeItem(`hirelane_questions_${id}`);
        localStorage.removeItem(`hirelane_feedback_${id}`);
        localStorage.removeItem(`hirelane_timeline_${id}`);
      }
      await reminderService.cancelRemindersForInterview(id);
      return true;
    }

    try {
      await reminderService.cancelRemindersForInterview(id);
      const { error } = await supabase
        .from("interviews")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      return !error;
    } catch (err) {
      console.error("[deleteInterview Error]", err);
      return false;
    }
  },

  async addQuestion(interviewId: string, userId: string, question: string) {
    if (!isSupabaseConfigured()) {
      const newQ: InterviewQuestion = {
        id: "q-" + Date.now(),
        interview_id: interviewId,
        user_id: userId,
        question,
        created_at: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        const key = `hirelane_questions_${interviewId}`;
        const current = JSON.parse(localStorage.getItem(key) || "[]");
        current.push(newQ);
        localStorage.setItem(key, JSON.stringify(current));
      }
      return newQ;
    }

    const { data } = await supabase
      .from("interview_questions")
      .insert({ interview_id: interviewId, user_id: userId, question })
      .select()
      .single();

    return data;
  },

  async saveNotes(interviewId: string, userId: string, notes: string) {
    return this.updateInterview(interviewId, userId, { preparation_notes: notes });
  },
};
