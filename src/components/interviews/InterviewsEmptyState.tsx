"use client";

import React from "react";
import { Calendar, Plus, FileText, HelpCircle, MessageSquare, Clipboard } from "lucide-react";

interface LeftListEmptyProps {
  onAddInterview: () => void;
}

export const LeftListEmptyState: React.FC<LeftListEmptyProps> = ({ onAddInterview }) => {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#EEF2FF] flex items-center justify-center text-[#0047FF] mb-4">
        <Calendar className="w-8 h-8" />
      </div>
      <h4 className="text-sm font-bold text-slate-900">No interviews scheduled yet</h4>
      <p className="text-xs text-slate-500 max-w-[200px] mt-1.5 leading-relaxed">
        Your upcoming interviews will appear here.
      </p>
      <button
        onClick={onAddInterview}
        className="mt-5 px-4 py-2.5 rounded-xl border border-[#0047FF] text-[#0047FF] hover:bg-[#EEF2FF] text-xs font-semibold transition-all flex items-center gap-1.5"
      >
        <Plus className="w-4 h-4" />
        <span>Add Your First Interview</span>
      </button>
    </div>
  );
};

export const RightDetailEmptyState: React.FC<{ onAddInterview: () => void }> = ({
  onAddInterview,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Hero Empty Card */}
      <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-full bg-[#EEF2FF] flex items-center justify-center text-[#0047FF] mb-4">
          <Calendar className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-900">No interview selected</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1.5 leading-relaxed">
          Select an interview from the list or add a new one to see the details here.
        </p>
      </div>

      {/* 2x2 Sub-Cards Placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center py-10">
          <Clipboard className="w-8 h-8 text-slate-300 mb-2" />
          <h5 className="text-xs font-bold text-slate-800">No details available</h5>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Interview details will be shown here once you add an interview.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center py-10">
          <FileText className="w-8 h-8 text-slate-300 mb-2" />
          <h5 className="text-xs font-bold text-slate-800">No preparation notes</h5>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Add notes and resources to prepare better for your interview.
          </p>
          <button
            onClick={onAddInterview}
            className="mt-3 px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
          >
            + Add Notes
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center py-10">
          <HelpCircle className="w-8 h-8 text-slate-300 mb-2" />
          <h5 className="text-xs font-bold text-slate-800">No questions yet</h5>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Questions asked in the interview will appear here.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 text-center flex flex-col items-center justify-center py-10">
          <MessageSquare className="w-8 h-8 text-slate-300 mb-2" />
          <h5 className="text-xs font-bold text-slate-800">No feedback yet</h5>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
            Feedback from the interviewer will appear here.
          </p>
        </div>
      </div>
    </div>
  );
};
