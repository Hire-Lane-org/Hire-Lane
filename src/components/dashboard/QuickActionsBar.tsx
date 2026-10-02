"use client";

import React from "react";
import { Plus, Calendar, Upload, FileEdit } from "lucide-react";

interface QuickActionsBarProps {
  onAddApplication: () => void;
  onAddInterview: () => void;
  onUploadResume: () => void;
  onAddNote: () => void;
}

export const QuickActionsBar: React.FC<QuickActionsBarProps> = ({
  onAddApplication,
  onAddInterview,
  onUploadResume,
  onAddNote,
}) => {
  const actions = [
    {
      label: "ADD APPLICATION",
      icon: Plus,
      onClick: onAddApplication,
    },
    {
      label: "ADD INTERVIEW",
      icon: Calendar,
      onClick: onAddInterview,
    },
    {
      label: "UPLOAD RESUME",
      icon: Upload,
      onClick: onUploadResume,
    },
    {
      label: "ADD NOTE",
      icon: FileEdit,
      onClick: onAddNote,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <h3 className="font-bold text-[#0F172A] text-base mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.label}
              onClick={act.onClick}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-slate-150 hover:border-blue-400 bg-white hover:bg-blue-50/30 transition-all group text-center shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[#EEF2FF] flex items-center justify-center text-slate-600 group-hover:text-[#0047FF] transition-colors mb-2.5 border border-slate-100">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-700 group-hover:text-[#0047FF] transition-colors uppercase">
                {act.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
