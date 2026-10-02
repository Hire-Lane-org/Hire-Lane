"use client";

import React from "react";

interface CompanyLogoProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

export const CompanyLogo: React.FC<CompanyLogoProps> = ({ name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];

  const lower = (name || "").toLowerCase();

  // Return stylized iconic color scheme for famous brands
  if (lower.includes("google")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-black flex items-center justify-center font-bold text-white shadow-sm shrink-0 border border-slate-800`}>
        <span className="text-amber-400">G</span>
      </div>
    );
  }
  if (lower.includes("amazon")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#131921] flex items-center justify-center font-bold text-[#FF9900] shadow-sm shrink-0 border border-slate-800`}>
        a
      </div>
    );
  }
  if (lower.includes("microsoft")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#00A4EF]/10 border border-[#00A4EF]/20 flex items-center justify-center font-bold text-[#00A4EF] shadow-sm shrink-0`}>
        M
      </div>
    );
  }
  if (lower.includes("adobe")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#FA0F00]/10 border border-[#FA0F00]/20 flex items-center justify-center font-bold text-[#FA0F00] shadow-sm shrink-0`}>
        A
      </div>
    );
  }
  if (lower.includes("netflix")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-black border border-slate-800 flex items-center justify-center font-black text-[#E50914] shadow-sm shrink-0`}>
        N
      </div>
    );
  }
  if (lower.includes("samsung")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#1428A0]/10 border border-[#1428A0]/20 flex items-center justify-center font-bold text-[#1428A0] shadow-sm shrink-0`}>
        S
      </div>
    );
  }
  if (lower.includes("flipkart")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-[#2874F0]/10 border border-[#2874F0]/20 flex items-center justify-center font-bold text-[#2874F0] shadow-sm shrink-0`}>
        fk
      </div>
    );
  }
  if (lower.includes("jp") || lower.includes("jpmorgan")) {
    return (
      <div className={`${sizeClasses} rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-white shadow-sm shrink-0`}>
        JPM
      </div>
    );
  }

  // Fallback initial
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className={`${sizeClasses} rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700 shadow-sm shrink-0`}>
      {initial}
    </div>
  );
};
