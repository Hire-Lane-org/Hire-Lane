"use client";

import React, { useRef } from "react";
import { User, Mail, Phone, MapPin, Linkedin, Camera, Edit2, Info } from "lucide-react";
import { Profile } from "@/types/database";

interface PersonalInfoCardProps {
  profile: Profile | null;
  onEdit: () => void;
  onAvatarUpload: (file: File) => void;
}

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({
  profile,
  onEdit,
  onAvatarUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEmpty = !profile?.full_name && !profile?.email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpload(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Personal Information</h3>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0047FF] hover:underline"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profile Avatar with Camera Upload Badge */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name || "User"}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-slate-300" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 rounded-full bg-[#0047FF] text-white shadow-md hover:bg-blue-700 transition-colors"
            title="Upload Photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* Metadata Details */}
        <div className="flex-1 w-full space-y-3 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Full Name
            </span>
            <span className="font-bold text-slate-900">
              {profile?.full_name || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Email
            </span>
            <span className="font-bold text-slate-900">
              {profile?.email || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              Phone
            </span>
            <span className="font-bold text-slate-900">
              {profile?.phone || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-50">
            <span className="text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Location
            </span>
            <span className="font-bold text-slate-900">
              {profile?.location || "-"}
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 flex items-center gap-2">
              <Linkedin className="w-3.5 h-3.5 text-slate-400" />
              LinkedIn
            </span>
            {profile?.linkedin_url ? (
              <a
                href={
                  profile.linkedin_url.startsWith("http")
                    ? profile.linkedin_url
                    : `https://${profile.linkedin_url}`
                }
                target="_blank"
                rel="noreferrer"
                className="text-[#0047FF] font-semibold hover:underline truncate max-w-[180px]"
              >
                {profile.linkedin_url} ↗
              </a>
            ) : (
              <span className="text-slate-400">-</span>
            )}
          </div>
        </div>
      </div>

      {isEmpty && (
        <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center gap-2 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>Add your personal details to get started.</span>
        </div>
      )}
    </div>
  );
};
