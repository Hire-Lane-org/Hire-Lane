"use client";

import React from "react";
import Link from "next/link";
import { Clock, Plus } from "lucide-react";
import { Application } from "@/types/database";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { getDeadlineCountdown } from "@/lib/utils";

interface UpcomingDeadlinesCardProps {
  applications: Application[];
  onAddApplication: () => void;
}

export const UpcomingDeadlinesCard: React.FC<UpcomingDeadlinesCardProps> = ({
  applications,
  onAddApplication,
}) => {
  const deadlineApps = applications
    .filter((a) => a.deadline)
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 2);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Upcoming Deadlines</h3>
        <Link
          href="/applications"
          className="text-xs font-semibold text-[#0047FF] hover:underline"
        >
          View all
        </Link>
      </div>

      {deadlineApps.length === 0 ? (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#ECFDF5] flex items-center justify-center text-[#10B981] mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No upcoming deadlines</h4>
          <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">
            Application deadlines will appear here.
          </p>
          <button
            onClick={onAddApplication}
            className="mt-4 px-4 py-2 rounded-xl border border-[#0047FF] text-[#0047FF] hover:bg-[#EEF2FF] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Application</span>
          </button>
        </div>
      ) : (
        /* Populated List */
        <div className="divide-y divide-slate-50 pt-2 space-y-2">
          {deadlineApps.map((app) => {
            const countdown = getDeadlineCountdown(app.deadline);
            return (
              <div
                key={app.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CompanyLogo name={app.company_name} size="md" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">
                      {app.company_name} {app.role.includes("Intern") ? "Internship" : app.role}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Application Deadline</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold shrink-0 ${
                    countdown.isUrgent
                      ? "text-red-500"
                      : countdown.isWarning
                      ? "text-amber-500"
                      : "text-slate-500"
                  }`}
                >
                  {countdown.text}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
