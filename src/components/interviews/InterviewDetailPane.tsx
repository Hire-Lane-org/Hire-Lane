"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  Edit2,
  MoreHorizontal,
  ExternalLink,
  Info,
  Plus,
  Trash2,
} from "lucide-react";
import { Interview, InterviewQuestion, InterviewFeedback, InterviewTimelineStage } from "@/types/database";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { InterviewTimeline } from "./InterviewTimeline";
import { formatDate } from "@/lib/utils";

interface InterviewDetailPaneProps {
  interview: Interview;
  questions: InterviewQuestion[];
  feedback: InterviewFeedback[];
  timeline: InterviewTimelineStage[];
  onEdit: (interview: Interview) => void;
  onDelete: (interview: Interview) => void;
  onAddQuestion: (q: string) => void;
  onSaveNotes: (notes: string) => void;
}

export const InterviewDetailPane: React.FC<InterviewDetailPaneProps> = ({
  interview,
  questions,
  feedback,
  timeline,
  onEdit,
  onDelete,
  onAddQuestion,
  onSaveNotes,
}) => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "notes" | "questions" | "feedback" | "timeline"
  >("overview");

  const [notesText, setNotesText] = useState(interview.preparation_notes || "");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const companyName = interview.applications?.company_name || "Company";

  const prepBulletPoints = (interview.preparation_notes || "")
    .split(/\r?\n/)
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);

  const handleAddQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newQuestionText.trim()) {
      onAddQuestion(newQuestionText.trim());
      setNewQuestionText("");
    }
  };

  const handleNotesSave = () => {
    onSaveNotes(notesText);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
      {/* Top Header Card */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <CompanyLogo name={companyName} size="lg" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                {companyName}
              </h2>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">
                {interview.round_title}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(interview)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Interview</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white p-1.5 shadow-xl border border-slate-100 z-30">
                  <button
                    onClick={() => {
                      setShowOptions(false);
                      onDelete(interview);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Interview</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-5 mt-5 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>{formatDate(interview.interview_date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{interview.interview_time}</span>
          </div>
          {interview.interviewers && interview.interviewers.length > 0 && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-slate-400" />
              <span>{interview.interviewers.join(", ")}</span>
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-6 mt-6 border-b border-slate-100 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: "overview", label: "Overview" },
            { id: "notes", label: "Preparation Notes" },
            { id: "questions", label: `Questions Asked (${questions.length})` },
            { id: "feedback", label: "Feedback" },
            { id: "timeline", label: "Timeline" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 relative transition-colors whitespace-nowrap ${
                  isActive ? "text-[#0047FF]" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0047FF] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Row 1 Grid: Details & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Interview Details Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-4">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  INTERVIEW DETAILS
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Round</span>
                    <span className="font-bold text-slate-900">{interview.round_title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Interviewers</span>
                    <span className="font-bold text-slate-900">
                      {interview.interviewers?.join(", ") || "John Doe"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Mode</span>
                    <span className="font-bold text-slate-900">{interview.mode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration</span>
                    <span className="font-bold text-slate-900">
                      {interview.duration_minutes || 60} minutes
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Location / Link</span>
                    {interview.meeting_link ? (
                      <a
                        href={
                          interview.meeting_link.startsWith("http")
                            ? interview.meeting_link
                            : `https://${interview.meeting_link}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0047FF] font-semibold flex items-center gap-1 hover:underline truncate max-w-[170px]"
                      >
                        <span className="truncate">{interview.meeting_link}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    ) : (
                      <span className="font-semibold text-slate-800">
                        {interview.venue || "Virtual"}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-slate-500">Outcome</span>
                    <StatusBadge status={interview.outcome || "Pending"} />
                  </div>
                </div>
              </div>

              {/* Preparation Notes Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    PREPARATION NOTES
                  </h4>
                  {prepBulletPoints.length > 0 ? (
                    <ul className="space-y-2 text-xs text-slate-700">
                      {prepBulletPoints.map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No notes added yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("notes")}
                  className="mt-4 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 self-start transition-colors"
                >
                  View All Notes
                </button>
              </div>
            </div>

            {/* Row 2 Grid: Questions & Feedback */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Questions Asked Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    QUESTIONS ASKED ({questions.length})
                  </h4>
                  {questions.length > 0 ? (
                    <ul className="space-y-2 text-xs text-slate-700">
                      {questions.slice(0, 3).map((q) => (
                        <li key={q.id} className="flex items-start gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                          <span>{q.question}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No questions recorded yet.</p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab("questions")}
                  className="mt-4 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 self-start transition-colors"
                >
                  View All Questions
                </button>
              </div>

              {/* Feedback Card */}
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  FEEDBACK
                </h4>
                {feedback.length > 0 ? (
                  <div className="space-y-2 text-xs text-slate-700">
                    {feedback.map((f) => (
                      <p key={f.id}>{f.feedback_text}</p>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#EFF6FF] border border-blue-100 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-900 leading-relaxed font-medium">
                      Feedback will be added after the interview.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Row 3: Interview Timeline */}
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                INTERVIEW TIMELINE
              </h4>
              <InterviewTimeline stages={timeline} />
            </div>
          </div>
        )}

        {/* Preparation Notes Tab */}
        {activeTab === "notes" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Preparation Notes</h4>
            <textarea
              rows={8}
              value={notesText}
              onChange={(e) => setNotesText(e.target.value)}
              placeholder="Add your study topics, algorithms, system design notes, STAR responses..."
              className="w-full p-4 text-xs leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
            />
            <button
              onClick={handleNotesSave}
              className="px-5 py-2.5 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-sm transition-all"
            >
              Save Preparation Notes
            </button>
          </div>
        )}

        {/* Questions Asked Tab */}
        {activeTab === "questions" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Questions Asked</h4>
            <form onSubmit={handleAddQuestionSubmit} className="flex gap-2">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                placeholder="e.g. How does garbage collection work in Node.js?"
                className="flex-1 px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shrink-0"
              >
                Add Question
              </button>
            </form>

            <div className="divide-y divide-slate-100 pt-2">
              {questions.map((q, idx) => (
                <div key={q.id} className="py-3 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-blue-50 text-[#0047FF] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 font-medium">{q.question}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === "feedback" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Interviewer Feedback</h4>
            {feedback.length > 0 ? (
              <div className="space-y-3">
                {feedback.map((f) => (
                  <div key={f.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <p className="text-slate-800 leading-relaxed">{f.feedback_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#EFF6FF] border border-blue-100 text-xs text-blue-900">
                No feedback recorded yet for this round.
              </div>
            )}
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === "timeline" && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900">Stage Progression</h4>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <InterviewTimeline stages={timeline} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
