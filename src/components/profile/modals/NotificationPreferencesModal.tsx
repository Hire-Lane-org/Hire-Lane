"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Check, ShieldCheck } from "lucide-react";
import { NotificationPreferences } from "@/types/database";
import { profileService } from "@/services/profileService";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
}

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  userId = "",
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      profileService.getNotificationPreferences(userId).then(setPrefs);
    }
  }, [isOpen, userId]);

  if (!isOpen || !prefs) return null;

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPrefs({ ...prefs, [key]: !prefs[key] });
  };

  const handleSave = async () => {
    setLoading(true);
    await profileService.updateNotificationPreferences(userId, prefs);
    setLoading(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-[#0047FF]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Notification Preferences
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage transactional email reminders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 py-4 text-xs">
          {/* Section 1: Deadline Emails */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">
                  Application Deadline Emails
                </p>
                <p className="text-[11px] text-slate-500">
                  Receive email alerts before deadlines pass
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefs.email_deadline_reminders}
                onChange={() => handleToggle("email_deadline_reminders")}
                className="w-4 h-4 rounded text-[#0047FF] focus:ring-blue-500"
              />
            </div>

            {prefs.email_deadline_reminders && (
              <div className="pl-2 pt-2 space-y-2 border-t border-slate-200/60 text-[11px] text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.deadline_7_days}
                    onChange={() => handleToggle("deadline_7_days")}
                    className="w-3.5 h-3.5 rounded text-[#0047FF]"
                  />
                  <span>7 days before deadline</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.deadline_3_days}
                    onChange={() => handleToggle("deadline_3_days")}
                    className="w-3.5 h-3.5 rounded text-[#0047FF]"
                  />
                  <span>3 days before deadline</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prefs.deadline_1_day}
                    onChange={() => handleToggle("deadline_1_day")}
                    className="w-3.5 h-3.5 rounded text-[#0047FF]"
                  />
                  <span>1 day before deadline (Urgent)</span>
                </label>
              </div>
            )}
          </div>

          {/* Section 2: Interview Reminders */}
          <div className="p-3.5 bg-slate-50/70 border border-slate-100 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">
                  Interview Reminder Emails
                </p>
                <p className="text-[11px] text-slate-500">
                  Receive email alerts with meeting links prior to calls
                </p>
              </div>
              <input
                type="checkbox"
                checked={prefs.email_interview_reminders}
                onChange={() => handleToggle("email_interview_reminders")}
                className="w-4 h-4 rounded text-[#0047FF] focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {saved && (
          <div className="mb-3 p-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-emerald-200">
            <Check className="w-4 h-4" />
            <span>Preferences saved successfully!</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            {loading ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );
};
