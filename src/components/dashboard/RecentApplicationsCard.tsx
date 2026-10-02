"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Plus, FileText, Search } from "lucide-react";
import { Application } from "@/types/database";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { getDeadlineCountdown } from "@/lib/utils";

interface RecentApplicationsCardProps {
  applications: Application[];
  onAddApplication: () => void;
}

export const RecentApplicationsCard: React.FC<RecentApplicationsCardProps> = ({
  applications,
  onAddApplication,
}) => {
  const [expanded, setExpanded] = useState(false);
  const displayItems = expanded ? applications.slice(0, 10) : applications.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Recent Applications</h3>
        <Link
          href="/applications"
          className="text-xs font-semibold text-[#0047FF] hover:underline"
        >
          View all
        </Link>
      </div>

      {applications.length === 0 ? (
        /* Empty State */
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#0047FF] mb-4">
            <Search className="w-7 h-7" />
          </div>
          <h4 className="text-base font-bold text-slate-900">No applications found</h4>
          <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
            Start tracking your job applications to see them here.
          </p>
          <button
            onClick={onAddApplication}
            className="mt-5 px-5 py-2.5 rounded-xl border-2 border-[#0047FF] text-[#0047FF] hover:bg-[#EEF2FF] text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Application</span>
          </button>
        </div>
      ) : (
        /* Populated Table */
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm mt-2">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-2">COMPANY</th>
                  <th className="py-3 px-2">ROLE</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">DEADLINE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayItems.map((app) => {
                  const countdown = getDeadlineCountdown(app.deadline);
                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-3">
                          <CompanyLogo name={app.company_name} size="sm" />
                          <span className="font-semibold text-slate-900 text-xs">
                            {app.company_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-xs text-slate-600 font-medium">
                        {app.role}
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-3 px-2 text-xs text-right font-medium">
                        <span
                          className={
                            countdown.isUrgent
                              ? "text-red-500 font-semibold"
                              : countdown.isWarning
                              ? "text-amber-600 font-semibold"
                              : "text-slate-500"
                          }
                        >
                          {countdown.text}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {applications.length > 5 && (
            <div className="pt-4 text-center border-t border-slate-50 mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0047FF] hover:underline"
              >
                <span>{expanded ? "Show less" : "Show more"}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    expanded ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
