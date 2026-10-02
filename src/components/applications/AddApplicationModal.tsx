"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Briefcase,
  MapPin,
  Calendar,
  User,
  Link as LinkIcon,
  Upload,
  FileText,
  Sparkles,
  Info,
  Check,
} from "lucide-react";
import { Application, Resume } from "@/types/database";
import { applicationService } from "@/services/applicationService";
import { resumeService } from "@/services/resumeService";
import { extractJobDetails } from "@/lib/parser/jobExtractor";

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newApp: Application) => void;
  userId?: string;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId = "",
}) => {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [appliedDate, setAppliedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [deadline, setDeadline] = useState("");
  const [applicationSource, setApplicationSource] = useState("");
  const [referral, setReferral] = useState("");
  const [jobPostingLink, setJobPostingLink] = useState("");

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoFillNotice, setAutoFillNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      resumeService.getResumes(userId).then((list) => {
        setResumes(list);
        const def = list.find((r) => r.is_default) || list[0];
        if (def) setSelectedResumeId(def.id);
      });
    }
  }, [isOpen, userId]);

  // SMART JOB DESCRIPTION AUTO-FILL
  // Listens to paste / typing in Job Description. Never overwrites manual inputs.
  const handleJobDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJobDescription(text);

    if (text.length > 20) {
      const extracted = extractJobDetails(text);
      let filledCount = 0;

      if (!companyName && extracted.companyName) {
        setCompanyName(extracted.companyName);
        filledCount++;
      }
      if (!role && extracted.role) {
        setRole(extracted.role);
        filledCount++;
      }
      if (!location && extracted.location) {
        setLocation(extracted.location);
        filledCount++;
      }
      if (!jobType && extracted.jobType) {
        setJobType(extracted.jobType);
        filledCount++;
      }
      if (!experienceLevel && extracted.experienceLevel) {
        setExperienceLevel(extracted.experienceLevel);
        filledCount++;
      }
      if (!jobPostingLink && extracted.jobPostingLink) {
        setJobPostingLink(extracted.jobPostingLink);
        filledCount++;
      }
      if (!applicationSource && extracted.applicationSource) {
        setApplicationSource(extracted.applicationSource);
        filledCount++;
      }

      if (filledCount > 0) {
        setAutoFillNotice(`✨ Auto-detected & filled ${filledCount} field${filledCount > 1 ? "s" : ""} from description!`);
        setTimeout(() => setAutoFillNotice(null), 4000);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Resume file size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!companyName.trim() || !role.trim()) {
      setError("Company Name and Role / Position are required.");
      return;
    }

    setLoading(true);

    try {
      let finalResumeId = selectedResumeId;

      // If user chose a new file directly in the modal, upload it first
      if (selectedFile) {
        const uploaded = await resumeService.uploadResume(userId, selectedFile, false);
        if (uploaded) finalResumeId = uploaded.id;
      }

      const created = await applicationService.createApplication(userId, {
        company_name: companyName.trim(),
        role: role.trim(),
        status: status as any,
        location: location.trim() || null,
        job_type: jobType || null,
        experience_level: experienceLevel || null,
        job_description: jobDescription.trim() || null,
        applied_date: appliedDate,
        deadline: deadline || null,
        application_source: applicationSource || null,
        referral: referral.trim() || null,
        job_posting_link: jobPostingLink.trim() || null,
        resume_id: finalResumeId || null,
      });

      if (created) {
        onSuccess(created);
        onClose();
      } else {
        setError("Failed to create application. Please check your input.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Add New Application
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add details about the job you have applied for.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-200">
              {error}
            </div>
          )}

          {autoFillNotice && (
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold border border-blue-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{autoFillNotice}</span>
            </div>
          )}

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role / Position <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. SDE Intern"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application Status <span className="text-red-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              >
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bangalore, India"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              >
                <option value="">Select job type</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Co-op">Co-op</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              >
                <option value="">Select experience level</option>
                <option value="Fresher">Fresher</option>
                <option value="0-1 years">0-1 years</option>
                <option value="1-3 years">1-3 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5+ years">5+ years</option>
              </select>
            </div>
          </div>

          {/* Row 4: Job Description with Smart Extraction */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Job Description / Notes
              </label>
              <span className="text-[11px] text-blue-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Paste description to auto-fill fields
              </span>
            </div>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={handleJobDescriptionChange}
              placeholder="Add any notes about the role, job description, requirements, etc."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 resize-none"
            />
          </div>

          {/* Row 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Applied Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={appliedDate}
                  onChange={(e) => setAppliedDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application Source
              </label>
              <select
                value={applicationSource}
                onChange={(e) => setApplicationSource(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              >
                <option value="">Select source</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Wellfound">Wellfound</option>
                <option value="Company Careers Portal">Company Careers Portal</option>
                <option value="Campus Placement">Campus Placement</option>
                <option value="Referral">Referral</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Referral (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="e.g. Referred by someone"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 7 */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Job Posting Link
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="url"
                value={jobPostingLink}
                onChange={(e) => setJobPostingLink(e.target.value)}
                placeholder="https://company.com/careers/job/123"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          {/* Row 8: Resume Upload Box matching Figma dashed drop area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Resume <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-6 text-center transition-all">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-[#0047FF] mx-auto mb-2">
                <FileText className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-900">Upload Resume</p>
              <p className="text-[11px] text-slate-400 mt-0.5">PDF/DOC/DOCX (Max. 5MB)</p>
              
              <div className="mt-3 flex items-center justify-center gap-2">
                <label className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm cursor-pointer transition-colors">
                  <span>{selectedFile ? selectedFile.name : "Choose File"}</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>

                {resumes.length > 0 && !selectedFile && (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-sm"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        Use {r.file_name} {r.is_default ? "(Default)" : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>This resume will be associated with this application.</span>
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all disabled:opacity-60 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Add Application"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
