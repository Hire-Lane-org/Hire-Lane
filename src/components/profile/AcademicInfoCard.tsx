"use client";

import React from "react";
import { GraduationCap, Building2, Calendar, Zap, Edit2, Info } from "lucide-react";
import { Profile } from "@/types/database";

interface AcademicInfoCardProps {
  profile: Profile | null;
  onEdit: () => void;
}

export const AcademicInfoCard: React.FC<AcademicInfoCardProps> = ({ profile, onEdit }) => {
  const isEmpty = !profile?.college && !profile?.degree;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Academic Information</h3>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0047FF] hover:underline"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="space-y-3.5 text-xs">
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            College / University
          </span>
          <span className="font-bold text-slate-900">
            {profile?.college || "-"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
            Degree
          </span>
          <span className="font-bold text-slate-900">
            {profile?.degree || "-"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Graduation Year
          </span>
          <span className="font-bold text-slate-900">
            {profile?.graduation_year || "-"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-slate-400" />
            Current CGPA
          </span>
          <span className="font-bold text-slate-900">
            {profile?.cgpa || "-"}
          </span>
        </div>
      </div>

      {isEmpty && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-2 text-xs text-blue-900 mt-4">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Add your academic details to showcase your educational background.</span>
        </div>
      )}
    </div>
  );
};
