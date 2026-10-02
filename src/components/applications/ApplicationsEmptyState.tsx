"use client";

import React from "react";
import { Plus, ClipboardList, Lightbulb } from "lucide-react";

interface ApplicationsEmptyStateProps {
  onAddApplication: () => void;
}

export const ApplicationsEmptyState: React.FC<ApplicationsEmptyStateProps> = ({
  onAddApplication,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {/* Visual Line-Art Illustration */}
      <div className="relative mb-6">
        <div className="w-24 h-28 rounded-2xl border-2 border-blue-600 bg-white p-3 flex flex-col justify-between shadow-sm">
          <div className="w-8 h-2 bg-blue-600 rounded-full mx-auto -mt-4 border-2 border-white shadow-sm" />
          <div className="space-y-2 mt-2">
            <div className="w-full h-1.5 bg-blue-600 rounded-full" />
            <div className="w-3/4 h-1.5 bg-blue-600 rounded-full" />
            <div className="w-4/5 h-1.5 bg-blue-600 rounded-full" />
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white self-end mt-2 shadow">
            <ClipboardList className="w-4 h-4" />
          </div>
        </div>
        {/* Floating subtle elements */}
        <span className="absolute -top-2 -left-6 text-blue-400 text-xs font-mono opacity-60">
          📋
        </span>
        <span className="absolute -bottom-2 -left-4 text-blue-400 text-xs font-mono opacity-60">
          📄
        </span>
        <span className="absolute top-8 -right-6 text-blue-400 text-xs font-mono opacity-60">
          ✨
        </span>
      </div>

      <h3 className="text-xl font-bold text-[#0F172A]">No applications yet</h3>
      <p className="text-xs text-slate-500 max-w-md mt-2 leading-relaxed">
        You haven&apos;t added any <strong className="font-semibold text-slate-700">job applications yet</strong>. Start tracking your applications to stay organized and never miss a deadline.
      </p>

      <button
        onClick={onAddApplication}
        className="mt-6 px-6 py-3 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-[0.99] flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span>Add Your First Application</span>
      </button>

      {/* Pro-Tip Callout Footer */}
      <div className="mt-16 pt-6 border-t border-slate-100 max-w-lg w-full text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong className="font-semibold text-slate-700">Why track your applications?</strong> Stay organized, track progress, and increase your chances of landing your dream role.
          </span>
        </p>
      </div>
    </div>
  );
};
