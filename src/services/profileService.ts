import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Profile, NotificationPreferences } from "@/types/database";

export const defaultNotificationPreferences = (userId: string): NotificationPreferences => ({
  user_id: userId,
  email_deadline_reminders: true,
  email_interview_reminders: true,
  deadline_7_days: true,
  deadline_3_days: true,
  deadline_1_day: true,
  deadline_on_day: true,
  interview_reminder_offsets: ["30 minutes before"],
});

export const createCleanProfile = (
  userId: string,
  userMeta?: { email?: string; full_name?: string }
): Profile => ({
  id: userId,
  full_name: userMeta?.full_name || null,
  email: userMeta?.email || null,
  phone: null,
  location: null,
  linkedin_url: null,
  avatar_url: null,
  college: null,
  degree: null,
  graduation_year: null,
  cgpa: null,
  preferred_roles: [],
  preferred_locations: [],
  work_authorization: "-",
  experience_level: "-",
  preferred_industries: [],
  preferred_company_size: null,
  notice_period: "-",
  bio: null,
});

export const profileService = {
  getLocalProfile(userId: string, userMeta?: { email?: string; full_name?: string }): Profile {
    if (typeof window === "undefined") {
      return createCleanProfile(userId, userMeta);
    }
    const key = `hirelane_profile_${userId}`;
    const stored = localStorage.getItem(key);
    if (!stored) {
      const clean = createCleanProfile(userId, userMeta);
      localStorage.setItem(key, JSON.stringify(clean));
      return clean;
    }
    try {
      const parsed = JSON.parse(stored);
      // Ensure user ID matches
      parsed.id = userId;
      if (userMeta?.email && !parsed.email) parsed.email = userMeta.email;
      if (userMeta?.full_name && !parsed.full_name) parsed.full_name = userMeta.full_name;
      return parsed;
    } catch {
      const clean = createCleanProfile(userId, userMeta);
      localStorage.setItem(key, JSON.stringify(clean));
      return clean;
    }
  },

  setLocalProfile(userId: string, profile: Profile) {
    if (typeof window === "undefined") return;
    const key = `hirelane_profile_${userId}`;
    localStorage.setItem(key, JSON.stringify(profile));
  },

  async getProfile(
    userId: string,
    userMeta?: { email?: string; full_name?: string }
  ): Promise<Profile> {
    if (!isSupabaseConfigured()) {
      return this.getLocalProfile(userId, userMeta);
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("[getProfile Error]", error);
      }

      if (!data) {
        // Automatically provision clean initial profile in Supabase
        const clean = createCleanProfile(userId, userMeta);
        const { data: inserted, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: userId,
            email: userMeta?.email || null,
            full_name: userMeta?.full_name || null,
          })
          .select()
          .single();

        if (!insertError && inserted) {
          return inserted as Profile;
        }
        return clean;
      }

      return data as Profile;
    } catch (err) {
      console.error("[getProfile Error]", err);
      return this.getLocalProfile(userId, userMeta);
    }
  },

  async updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
    if (!isSupabaseConfigured()) {
      const current = this.getLocalProfile(userId);
      const updated = { ...current, ...updates, id: userId };
      this.setLocalProfile(userId, updated);
      return updated;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", userId)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    } catch (err) {
      console.error("[updateProfile Error]", err);
      const current = this.getLocalProfile(userId);
      const fallback = { ...current, ...updates, id: userId };
      this.setLocalProfile(userId, fallback);
      return fallback;
    }
  },

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const key = `hirelane_prefs_${userId}`;
    const defaults = defaultNotificationPreferences(userId);

    if (!isSupabaseConfigured()) {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(key);
        if (stored) {
          try {
            return JSON.parse(stored);
          } catch {}
        }
      }
      return defaults;
    }

    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("[getNotificationPreferences Error]", error);
      }

      return data || defaults;
    } catch {
      return defaults;
    }
  },

  async updateNotificationPreferences(
    userId: string,
    prefs: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const key = `hirelane_prefs_${userId}`;

    if (!isSupabaseConfigured()) {
      const current = await this.getNotificationPreferences(userId);
      const updated = { ...current, ...prefs, user_id: userId };
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(updated));
      }
      return updated;
    }

    try {
      const { data, error } = await supabase
        .from("notification_preferences")
        .upsert({ user_id: userId, ...prefs, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("[updateNotificationPreferences Error]", err);
      return defaultNotificationPreferences(userId);
    }
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    if (!isSupabaseConfigured()) {
      const url = URL.createObjectURL(file);
      await this.updateProfile(userId, { avatar_url: url });
      return url;
    }

    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${userId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      await this.updateProfile(userId, { avatar_url: publicUrl });
      return publicUrl;
    } catch (err) {
      console.error("[uploadAvatar Error]", err);
      return null;
    }
  },

  async exportUserData(userId: string) {
    const profile = await this.getProfile(userId);
    const prefs = await this.getNotificationPreferences(userId);

    const archive = {
      exported_at: new Date().toISOString(),
      user_id: userId,
      profile,
      notification_preferences: prefs,
      version: "1.0.0",
    };

    const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hirelane-data-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  async deleteAccount(userId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(`hirelane_profile_${userId}`);
        localStorage.removeItem(`hirelane_apps_${userId}`);
        localStorage.removeItem(`hirelane_interviews_${userId}`);
        localStorage.removeItem(`hirelane_resumes_${userId}`);
        localStorage.removeItem(`hirelane_prefs_${userId}`);
        localStorage.removeItem("hirelane_current_session");
      }
      return true;
    }

    try {
      const { error } = await supabase.from("profiles").delete().eq("id", userId);
      await supabase.auth.signOut();
      return !error;
    } catch (err) {
      console.error("[deleteAccount Error]", err);
      return false;
    }
  },
};
