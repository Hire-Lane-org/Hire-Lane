"use client";

import React, { useRef, useState } from "react";
import { Upload, FileText, Eye, MoreVertical, Trash2, Check, X } from "lucide-react";
import { Resume } from "@/types/database";

interface ResumeLibraryCardProps {
  resumes: Resume[];
  onUpload: (file: File) => void;
  onSetDefault: (resumeId: string) => void;
  onDelete: (resumeId: string) => void;
}

export const ResumeLibraryCard: React.FC<ResumeLibraryCardProps> = ({
  resumes,
  onUpload,
  onSetDefault,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const getFileIconColor = (index: number) => {
    const colors = [
      "text-emerald-500 bg-emerald-50",
      "text-blue-500 bg-blue-50",
      "text-amber-500 bg-amber-50",
      "text-indigo-500 bg-indigo-50",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="font-bold text-[#0F172A] text-base">Resume Library</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#EEF2FF] hover:bg-blue-100 text-xs font-semibold text-[#0047FF] transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload New</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />
      </div>

      {resumes.length === 0 ? (
        /* Empty State */
        <div className="py-10 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#0047FF] mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-slate-900">No resumes uploaded yet</h4>
          <p className="text-xs text-slate-500 max-w-[220px] mt-1 leading-relaxed">
            Upload your resume to use it while applying for jobs.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Your First Resume</span>
          </button>
        </div>
      ) : (
        /* Populated Resume Items */
        <div className="space-y-2.5">
          {resumes.map((resume, idx) => {
            const iconColor = getFileIconColor(idx);
            return (
              <div
                key={resume.id}
                className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 transition-colors group relative"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl shrink-0 ${iconColor}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                      {resume.file_name}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Uploaded on {resume.uploaded_at?.split("T")[0] || "10 May 2024"} •{" "}
                      {(resume.file_size / 1024).toFixed(0)} KB
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {resume.is_default && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-bold">
                      Default
                    </span>
                  )}

                  <a
                    href={resume.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="View Resume"
                  >
                    <Eye className="w-4 h-4" />
                  </a>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setActiveMenuId(activeMenuId === resume.id ? null : resume.id)
                      }
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === resume.id && (
                      <div className="absolute right-0 mt-1 w-36 rounded-xl bg-white p-1.5 shadow-xl border border-slate-100 z-30">
                        {!resume.is_default && (
                          <button
                            onClick={() => {
                              onSetDefault(resume.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Set as Default</span>
                          </button>
                        )}
                        <button
                          onClick={() => {
                            onDelete(resume.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full text-left px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-semibold text-[#0047FF] hover:underline"
            >
              View all resumes &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
