"use client";

import React from "react";

interface WelcomeBannerProps {
  userName?: string | null;
  isEmptyState?: boolean;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  userName,
  isEmptyState = false,
}) => {
  return (
    <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2.5">
        {isEmptyState ? (
          "Welcome To Hirelane !"
        ) : (
          <>
            Welcome back, {userName || "there"}! <span className="inline-block animate-pulse">👋</span>
          </>
        )}
      </h2>
      <p className="text-sm text-slate-500 mt-2 font-normal">
        Keep tracking, keep improving, land your dream role.
      </p>
    </div>
  );
};
