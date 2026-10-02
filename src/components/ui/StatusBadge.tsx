"use client";

import React from "react";
import { ApplicationStatus } from "@/types/database";

interface StatusBadgeProps {
  status: ApplicationStatus | string;
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, dot = false }) => {
  let badgeStyles = "bg-slate-100 text-slate-700";
  let dotColor = "bg-slate-400";

  switch (status) {
    case "Applied":
      badgeStyles = "bg-[#EFF6FF] text-[#2563EB]";
      dotColor = "bg-[#2563EB]";
      break;
    case "Assessment":
      badgeStyles = "bg-[#FEF3C7] text-[#D97706]";
      dotColor = "bg-[#D97706]";
      break;
    case "Interviewing":
      badgeStyles = "bg-[#EEF2FF] text-[#4F46E5]";
      dotColor = "bg-[#4F46E5]";
      break;
    case "Offer":
      badgeStyles = "bg-[#ECFDF5] text-[#10B981]";
      dotColor = "bg-[#10B981]";
      break;
    case "Rejected":
      badgeStyles = "bg-[#FEE2E2] text-[#EF4444]";
      dotColor = "bg-[#EF4444]";
      break;
    case "Upcoming":
      badgeStyles = "bg-[#EFF6FF] text-[#0047FF]";
      dotColor = "bg-[#0047FF]";
      break;
    case "Scheduled":
      badgeStyles = "bg-[#FEF3C7] text-[#D97706]";
      dotColor = "bg-[#D97706]";
      break;
    default:
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${badgeStyles}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      <span>{status}</span>
    </span>
  );
};
