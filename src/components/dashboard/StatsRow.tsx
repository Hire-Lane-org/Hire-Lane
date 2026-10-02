"use client";

import React from "react";
import { Inbox, Calendar, ShieldAlert, Mail, ArrowUp } from "lucide-react";

interface StatsRowProps {
  totalApplications: number;
  interviews: number;
  deadlines: number;
  activeApplications: number;
  isEmptyState?: boolean;
}

export const StatsRow: React.FC<StatsRowProps> = ({
  totalApplications,
  interviews,
  deadlines,
  activeApplications,
  isEmptyState = false,
}) => {
  const cards = [
    {
      title: "TOTAL APPLICATIONS",
      value: totalApplications,
      subtext: isEmptyState ? "No applications yet" : "↑ 12 this week",
      hasDelta: !isEmptyState && totalApplications > 0,
      icon: Inbox,
      iconBg: "bg-[#F3E8FF] text-[#9333EA]", // Light purple
    },
    {
      title: "INTERVIEWS",
      value: interviews,
      subtext: isEmptyState ? "No interviews scheduled" : "↑ 3 this week",
      hasDelta: !isEmptyState && interviews > 0,
      icon: Calendar,
      iconBg: "bg-[#E0F2FE] text-[#0284C7]", // Light blue
    },
    {
      title: "DEADLINES",
      value: deadlines,
      subtext: isEmptyState ? "No deadlines" : "Due in next 7 days",
      hasDelta: false,
      icon: ShieldAlert,
      iconBg: "bg-[#FEE2E2] text-[#DC2626]", // Light red
    },
    {
      title: "ACTIVE APPLICATIONS",
      value: activeApplications,
      subtext: isEmptyState ? "Start tracking today" : "In progress",
      hasDelta: false,
      icon: Mail,
      iconBg: "bg-[#DCFCE7] text-[#16A34A]", // Light green
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex items-start gap-4 transition-all hover:shadow-md"
          >
            <div
              className={`p-3 rounded-xl shrink-0 flex items-center justify-center ${card.iconBg}`}
            >
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {card.title}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1 tracking-tight">
                {card.value}
              </p>
              <div className="mt-1.5 flex items-center gap-1 text-xs">
                {card.hasDelta && (
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </span>
                )}
                <span
                  className={
                    card.hasDelta
                      ? "text-emerald-600 font-medium"
                      : "text-slate-400"
                  }
                >
                  {card.subtext}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
