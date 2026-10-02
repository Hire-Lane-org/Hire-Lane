"use client";

import React from "react";
import {
  Briefcase,
  MapPin,
  Shield,
  UserCheck,
  Building,
  Clock,
  FileText,
  Edit2,
  Info,
} from "lucide-react";
import { Profile } from "@/types/database";

interface CareerPreferencesCardProps {
  profile: Profile | null;
  onEdit: () => void;
}

export const CareerPreferencesCard: React.FC<CareerPreferencesCardProps> = ({
  profile,
  onEdit,
}) => {
  const isEmpty =
    (!profile?.preferred_roles || profile.preferred_roles.length === 0) &&
    (!profile?.bio || profile.bio === "-");

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Career Preferences</h3>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0047FF] hover:underline"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="space-y-3.5 text-xs">
        {/* Preferred Roles */}
        <div className="flex items-start justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2 shrink-0 mt-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            Preferred Roles
          </span>
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[65%]">
            {profile?.preferred_roles && profile.preferred_roles.length > 0 ? (
              profile.preferred_roles.map((r) => (
                <span
                  key={r}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]"
                >
                  {r}
                </span>
              ))
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Preferred Locations */}
        <div className="flex items-start justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2 shrink-0 mt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Preferred Locations
          </span>
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[65%]">
            {profile?.preferred_locations && profile.preferred_locations.length > 0 ? (
              profile.preferred_locations.map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]"
                >
                  {loc}
                </span>
              ))
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Work Authorization */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            Work Authorization
          </span>
          <span className="font-bold text-slate-900">
            {profile?.work_authorization || "Indian Citizen"}
          </span>
        </div>

        {/* Experience Level */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            Experience Level
          </span>
          <span className="font-bold text-slate-900">
            {profile?.experience_level || "Fresher"}
          </span>
        </div>

        {/* Preferred Industries */}
        <div className="flex items-start justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2 shrink-0 mt-1">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            Preferred Industries
          </span>
          <div className="flex flex-wrap justify-end gap-1.5 max-w-[65%]">
            {profile?.preferred_industries && profile.preferred_industries.length > 0 ? (
              profile.preferred_industries.map((ind) => (
                <span
                  key={ind}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]"
                >
                  {ind}
                </span>
              ))
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>

        {/* Notice Period */}
        <div className="flex items-center justify-between py-1 border-b border-slate-50">
          <span className="text-slate-500 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Notice Period
          </span>
          <span className="font-bold text-slate-900">
            {profile?.notice_period || "Immediate"}
          </span>
        </div>

        {/* Bio */}
        <div className="py-1">
          <span className="text-slate-500 flex items-center gap-2 mb-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Bio
          </span>
          <p className="text-slate-700 leading-relaxed font-medium">
            {profile?.bio || "-"}
          </p>
        </div>
      </div>

      {isEmpty && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-2 text-xs text-blue-900 mt-4">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Share your career preferences to get better opportunities tailored for you.</span>
        </div>
      )}
    </div>
  );
};
