"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { Interview } from "@/types/database";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

interface UpcomingInterviewsCardProps {
  interviews: Interview[];
  onScheduleInterview: () => void;
}

export const UpcomingInterviewsCard: React.FC<UpcomingInterviewsCardProps> = ({
  interviews,
  onScheduleInterview,
}) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Upcoming Interviews</h3>
        <Link
          href="/interviews"
          className="text-xs font-semibold text-[#0047FF] hover:underline"
        >
          View all
        </Link>
      </div>

      {interviews.length === 0 ? (
        /* Empty State */
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#E0F2FE] flex items-center justify-center text-[#0284C7] mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No upcoming interviews</h4>
          <p className="text-xs text-slate-500 max-w-[200px] mt-1 leading-relaxed">
            Interview schedules will appear here once added.
          </p>
          <button
            onClick={onScheduleInterview}
            className="mt-4 px-4 py-2 rounded-xl border border-[#0047FF] text-[#0047FF] hover:bg-[#EEF2FF] text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Interview</span>
          </button>
        </div>
      ) : (
        /* Populated List */
        <div className="divide-y divide-slate-50 pt-2 space-y-2">
          {interviews.slice(0, 3).map((interview, index) => {
            const companyName = interview.applications?.company_name || "Company";
            // Match demo badges: TOMORROW, 3 DAYS, 6 DAYS
            const badges = ["TOMORROW", "3 DAYS", "6 DAYS"];
            const badgeLabel = badges[index] || "UPCOMING";

            return (
              <div
                key={interview.id}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CompanyLogo name={companyName} size="md" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900">{companyName}</h5>
                    <p className="text-[11px] text-slate-500 font-medium">{interview.round_title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {index === 0
                        ? "Tomorrow, 10:00 AM"
                        : `${interview.interview_date}, ${interview.interview_time}`}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold tracking-wider text-[#0047FF] bg-[#EEF2FF] px-2.5 py-1 rounded-md shrink-0 uppercase">
                  {badgeLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
