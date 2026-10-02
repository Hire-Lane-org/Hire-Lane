"use client";

import React from "react";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Briefcase,
  ExternalLink,
  FileText,
  Edit2,
  Trash2,
} from "lucide-react";
import { Application } from "@/types/database";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDate, getDeadlineCountdown } from "@/lib/utils";

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onEdit: (app: Application) => void;
  onDelete: (app: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !application) return null;

  const countdown = getDeadlineCountdown(application.deadline);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo name={application.company_name} size="lg" />
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-slate-900">
                  {application.company_name}
                </h3>
                <StatusBadge status={application.status} />
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {application.role}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-medium">Location</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {application.location || "Not specified"}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Job Type</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                {application.job_type || "Full-time"}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Applied Date</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(application.applied_date)}
              </p>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Application Deadline</span>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {application.deadline ? (
                  <>
                    <span>{formatDate(application.deadline)}</span>
                    <span
                      className={`text-[11px] font-bold ${
                        countdown.isUrgent ? "text-red-500" : "text-amber-600"
                      }`}
                    >
                      ({countdown.text})
                    </span>
                  </>
                ) : (
                  "No deadline set"
                )}
              </p>
            </div>
          </div>

          {/* Job Description */}
          {application.job_description && (
            <div>
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Description & Notes
              </h4>
              <div className="text-xs text-slate-600 bg-white p-4 rounded-xl border border-slate-100 whitespace-pre-wrap leading-relaxed">
                {application.job_description}
              </div>
            </div>
          )}

          {/* External Links */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {application.job_posting_link && (
              <a
                href={application.job_posting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Job Posting</span>
              </a>
            )}
            {application.resume_id && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 text-xs font-semibold text-[#0047FF]">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume Attached</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={() => {
              onClose();
              onDelete(application);
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(application);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
