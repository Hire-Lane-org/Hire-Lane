"use client";

import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { Profile } from "@/types/database";

interface EditCareerPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile | null;
  onSave: (data: Partial<Profile>) => Promise<void>;
}

export const EditCareerPreferencesModal: React.FC<EditCareerPreferencesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [preferredLocations, setPreferredLocations] = useState<string[]>([]);
  const [newLocation, setNewLocation] = useState("");
  const [workAuth, setWorkAuth] = useState("Indian Citizen");
  const [experienceLevel, setExperienceLevel] = useState("Fresher");
  const [preferredIndustries, setPreferredIndustries] = useState<string[]>([]);
  const [newIndustry, setNewIndustry] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("Immediate");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setPreferredRoles(profile.preferred_roles || []);
      setPreferredLocations(profile.preferred_locations || []);
      setWorkAuth(profile.work_authorization || "Indian Citizen");
      setExperienceLevel(profile.experience_level || "Fresher");
      setPreferredIndustries(profile.preferred_industries || []);
      setNoticePeriod(profile.notice_period || "Immediate");
      setBio(profile.bio || "");
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleAddRole = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newRole.trim()) {
      e.preventDefault();
      if (!preferredRoles.includes(newRole.trim())) {
        setPreferredRoles([...preferredRoles, newRole.trim()]);
      }
      setNewRole("");
    }
  };

  const handleAddLocation = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newLocation.trim()) {
      e.preventDefault();
      if (!preferredLocations.includes(newLocation.trim())) {
        setPreferredLocations([...preferredLocations, newLocation.trim()]);
      }
      setNewLocation("");
    }
  };

  const handleAddIndustry = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newIndustry.trim()) {
      e.preventDefault();
      if (!preferredIndustries.includes(newIndustry.trim())) {
        setPreferredIndustries([...preferredIndustries, newIndustry.trim()]);
      }
      setNewIndustry("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      preferred_roles: preferredRoles,
      preferred_locations: preferredLocations,
      work_authorization: workAuth,
      experience_level: experienceLevel,
      preferred_industries: preferredIndustries,
      notice_period: noticePeriod,
      bio: bio.trim() || null,
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">
            Edit Career Preferences
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Preferred Roles Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Roles (type & press enter)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[40px]">
              {preferredRoles.map((role) => (
                <span
                  key={role}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <span>{role}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferredRoles(preferredRoles.filter((r) => r !== role))
                    }
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                onKeyDown={handleAddRole}
                placeholder="Add role..."
                className="flex-1 min-w-[90px] text-xs bg-transparent border-none focus:outline-none px-1"
              />
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Locations (type & press enter)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-xl min-h-[40px]">
              {preferredLocations.map((loc) => (
                <span
                  key={loc}
                  className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setPreferredLocations(preferredLocations.filter((l) => l !== loc))
                    }
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={handleAddLocation}
                placeholder="Add location..."
                className="flex-1 min-w-[90px] text-xs bg-transparent border-none focus:outline-none px-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Work Authorization
              </label>
              <input
                type="text"
                value={workAuth}
                onChange={(e) => setWorkAuth(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
              >
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Notice Period
            </label>
            <select
              value={noticePeriod}
              onChange={(e) => setNoticePeriod(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
            >
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="1 Month">1 Month</option>
              <option value="2 Months">2 Months</option>
              <option value="3 Months">3 Months</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell recruiters about yourself..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-sm"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
