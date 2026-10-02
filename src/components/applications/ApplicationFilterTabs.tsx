"use client";

import React from "react";
import { Plus } from "lucide-react";

interface ApplicationFilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAddApplication: () => void;
}

export const ApplicationFilterTabs: React.FC<ApplicationFilterTabsProps> = ({
  activeTab,
  onTabChange,
  onAddApplication,
}) => {
  const tabs = [
    { label: "All", value: "All" },
    { label: "Applied", value: "Applied", dotColor: "bg-[#2563EB]" },
    { label: "Assessment", value: "Assessment", dotColor: "bg-[#D97706]" },
    { label: "Interviewing", value: "Interviewing", dotColor: "bg-[#4F46E5]" },
    { label: "Offer", value: "Offer", dotColor: "bg-[#10B981]" },
    { label: "Rejected", value: "Rejected", dotColor: "bg-[#EF4444]" },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Horizontal Filter Pill Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#0047FF] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {tab.dotColor && !isActive && (
                <span className={`w-2 h-2 rounded-full ${tab.dotColor}`} />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Add Application Primary Button */}
      <button
        onClick={onAddApplication}
        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all active:scale-[0.99] shrink-0"
      >
        <Plus className="w-4 h-4" />
        <span>Add Application</span>
      </button>
    </div>
  );
};
