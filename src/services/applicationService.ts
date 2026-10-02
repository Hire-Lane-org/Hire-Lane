import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Application, ApplicationStatus } from "@/types/database";
import { reminderService } from "./reminderService";

export interface ApplicationsFilter {
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export const applicationService = {
  getLocalApplications(userId: string): Application[] {
    if (typeof window === "undefined") return [];
    const key = `hirelane_apps_${userId}`;
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

  setLocalApplications(userId: string, apps: Application[]) {
    if (typeof window === "undefined") return;
    const key = `hirelane_apps_${userId}`;
    localStorage.setItem(key, JSON.stringify(apps));
  },

  async getApplications(userId: string, filter?: ApplicationsFilter) {
    const { status, search, page = 1, pageSize = 8 } = filter || {};

    if (!isSupabaseConfigured()) {
      let list = this.getLocalApplications(userId);

      if (status && status !== "All") {
        list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase());
      }

      if (search && search.trim().length > 0) {
        const q = search.toLowerCase();
        list = list.filter(
          (a) =>
            a.company_name.toLowerCase().includes(q) ||
            a.role.toLowerCase().includes(q) ||
            (a.location && a.location.toLowerCase().includes(q))
        );
      }

      const total = list.length;
      const from = (page - 1) * pageSize;
      const paged = list.slice(from, from + pageSize);

      return { data: paged, total, page, pageSize };
    }

    try {
      let query = supabase
        .from("applications")
        .select("*, resumes(*)", { count: "exact" })
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (status && status !== "All") {
        query = query.eq("status", status);
      }

      if (search && search.trim().length > 0) {
        const q = `%${search.trim()}%`;
        query = query.or(`company_name.ilike.${q},role.ilike.${q},location.ilike.${q}`);
      }

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (error) throw error;

      return {
        data: (data as Application[]) || [],
        total: count || 0,
        page,
        pageSize,
      };
    } catch (err) {
      console.error("[getApplications Error]", err);
      return { data: [], total: 0, page, pageSize };
    }
  },

  async createApplication(userId: string, appData: Partial<Application>): Promise<Application | null> {
    if (!isSupabaseConfigured()) {
      const newApp: Application = {
        id: "app-" + Date.now(),
        user_id: userId,
        company_name: appData.company_name || "",
        role: appData.role || "",
        status: (appData.status as ApplicationStatus) || "Applied",
        location: appData.location || null,
        job_type: appData.job_type || null,
        experience_level: appData.experience_level || null,
        job_description: appData.job_description || null,
        applied_date: appData.applied_date || new Date().toISOString().split("T")[0],
        deadline: appData.deadline || null,
        application_source: appData.application_source || null,
        referral: appData.referral || null,
        job_posting_link: appData.job_posting_link || null,
        resume_id: appData.resume_id || null,
      };

      const current = this.getLocalApplications(userId);
      this.setLocalApplications(userId, [newApp, ...current]);
      await reminderService.scheduleDeadlineReminders(userId, newApp.id, newApp.deadline);
      return newApp;
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .insert({
          user_id: userId,
          company_name: appData.company_name,
          role: appData.role,
          status: appData.status || "Applied",
          location: appData.location,
          job_type: appData.job_type,
          experience_level: appData.experience_level,
          job_description: appData.job_description,
          applied_date: appData.applied_date || new Date().toISOString().split("T")[0],
          deadline: appData.deadline,
          application_source: appData.application_source,
          referral: appData.referral,
          job_posting_link: appData.job_posting_link,
          resume_id: appData.resume_id,
        })
        .select("*, resumes(*)")
        .single();

      if (error) throw error;
      if (data) {
        await reminderService.scheduleDeadlineReminders(userId, data.id, data.deadline);
      }
      return data;
    } catch (err) {
      console.error("[createApplication Error]", err);
      return null;
    }
  },

  async updateApplication(id: string, userId: string, appData: Partial<Application>): Promise<Application | null> {
    if (!isSupabaseConfigured()) {
      const list = this.getLocalApplications(userId);
      const idx = list.findIndex((a) => a.id === id && a.user_id === userId);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...appData };
        this.setLocalApplications(userId, [...list]);
        if (appData.deadline !== undefined) {
          await reminderService.scheduleDeadlineReminders(userId, id, appData.deadline);
        }
        return list[idx];
      }
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("applications")
        .update({
          company_name: appData.company_name,
          role: appData.role,
          status: appData.status,
          location: appData.location,
          job_type: appData.job_type,
          experience_level: appData.experience_level,
          job_description: appData.job_description,
          applied_date: appData.applied_date,
          deadline: appData.deadline,
          application_source: appData.application_source,
          referral: appData.referral,
          job_posting_link: appData.job_posting_link,
          resume_id: appData.resume_id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select("*, resumes(*)")
        .single();

      if (error) throw error;
      if (data && appData.deadline !== undefined) {
        await reminderService.scheduleDeadlineReminders(userId, id, data.deadline);
      }
      return data;
    } catch (err) {
      console.error("[updateApplication Error]", err);
      return null;
    }
  },

  async deleteApplication(id: string, userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      const list = this.getLocalApplications(userId);
      this.setLocalApplications(
        userId,
        list.filter((a) => a.id !== id)
      );
      await reminderService.cancelRemindersForApplication(id);
      return true;
    }

    try {
      await reminderService.cancelRemindersForApplication(id);
      const { error } = await supabase
        .from("applications")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      return !error;
    } catch (err) {
      console.error("[deleteApplication Error]", err);
      return false;
    }
  },

  async getDashboardStats(userId: string) {
    if (!isSupabaseConfigured()) {
      const apps = this.getLocalApplications(userId);
      const totalApplications = apps.length;
      const activeApplications = apps.filter(
        (a) => a.status !== "Rejected" && a.status !== "Offer"
      ).length;

      // Get local interviews count
      let interviewsCount = 0;
      if (typeof window !== "undefined") {
        const intStored = localStorage.getItem(`hirelane_interviews_${userId}`);
        if (intStored) {
          try {
            interviewsCount = JSON.parse(intStored).length;
          } catch {}
        }
      }

      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const next7Days = new Date();
      next7Days.setDate(now.getDate() + 7);
      next7Days.setHours(23, 59, 59, 999);

      const upcomingDeadlines = apps.filter((a) => {
        if (!a.deadline) return false;
        const d = new Date(a.deadline);
        return d >= now && d <= next7Days;
      }).length;

      return {
        totalApplications,
        interviews: interviewsCount,
        deadlines: upcomingDeadlines,
        activeApplications,
      };
    }

    try {
      const { count: totalApplications } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const { count: activeApplications } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .not("status", "in", '("Offer","Rejected")');

      const { count: interviewCount } = await supabase
        .from("interviews")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);

      const today = new Date().toISOString().split("T")[0];
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

      const { count: deadlineCount } = await supabase
        .from("applications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("deadline", today)
        .lte("deadline", nextWeek);

      return {
        totalApplications: totalApplications || 0,
        interviews: interviewCount || 0,
        deadlines: deadlineCount || 0,
        activeApplications: activeApplications || 0,
      };
    } catch (err) {
      console.error("[getDashboardStats Error]", err);
      return {
        totalApplications: 0,
        interviews: 0,
        deadlines: 0,
        activeApplications: 0,
      };
    }
  },
};
