"use client";

import React from "react";
import { KeyRound, Bell, Download, Trash2, ChevronRight } from "lucide-react";

interface QuickLinksCardProps {
  onChangePassword: () => void;
  onNotificationPreferences: () => void;
  onDownloadData: () => void;
  onDeleteAccount: () => void;
}

export const QuickLinksCard: React.FC<QuickLinksCardProps> = ({
  onChangePassword,
  onNotificationPreferences,
  onDownloadData,
  onDeleteAccount,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="font-bold text-[#0F172A] text-sm px-1">Quick Links</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Change Password */}
        <button
          onClick={onChangePassword}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 group-hover:text-slate-900">
              <KeyRound className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Change Password
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Notification Preferences */}
        <button
          onClick={onNotificationPreferences}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 group-hover:text-slate-900">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Notification Preferences
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Download My Data */}
        <button
          onClick={onDownloadData}
          className="p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-slate-50 text-slate-600 group-hover:text-slate-900">
              <Download className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold text-slate-800">
              Download My Data
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Delete Account (Destructive) */}
        <button
          onClick={onDeleteAccount}
          className="p-4 bg-white hover:bg-red-50/50 border border-slate-100 hover:border-red-100 rounded-2xl flex items-center justify-between transition-all shadow-[0_1px_2px_rgba(0,0,0,0.02)] group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-50 text-red-500">
              <Trash2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-red-600">
              Delete Account
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
