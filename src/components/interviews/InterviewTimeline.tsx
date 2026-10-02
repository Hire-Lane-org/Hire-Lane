"use client";

import React from "react";
import { Check } from "lucide-react";
import { InterviewTimelineStage } from "@/types/database";

interface InterviewTimelineProps {
  stages?: InterviewTimelineStage[];
}

export const InterviewTimeline: React.FC<InterviewTimelineProps> = ({
  stages = [
    { id: "1", interview_id: "", user_id: "", stage_name: "Applied", stage_date: "18 May 2024", completed: true, is_current: false, sort_order: 1 },
    { id: "2", interview_id: "", user_id: "", stage_name: "Screening", stage_date: "19 May 2024", completed: true, is_current: false, sort_order: 2 },
    { id: "3", interview_id: "", user_id: "", stage_name: "Technical Round", stage_date: "22 May 2024", completed: false, is_current: true, sort_order: 3 },
    { id: "4", interview_id: "", user_id: "", stage_name: "HR Round", stage_date: "--", completed: false, is_current: false, sort_order: 4 },
  ],
}) => {
  return (
    <div className="w-full py-4 px-2">
      <div className="relative flex items-center justify-between">
        {/* Connecting background track */}
        <div className="absolute left-6 right-6 top-3 h-0.5 bg-slate-200 -z-0" />

        {stages.map((stage, idx) => {
          const isDone = stage.completed;
          const isCurrent = stage.is_current;

          return (
            <div key={stage.id || idx} className="relative z-10 flex flex-col items-center">
              {/* Milestone Node */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? "bg-[#0047FF] text-white shadow-sm ring-4 ring-blue-50"
                    : isCurrent
                    ? "bg-[#0047FF] text-white ring-4 ring-blue-100 shadow"
                    : "bg-white border-2 border-slate-300"
                }`}
              >
                {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                {isCurrent && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              {/* Stage Name & Date */}
              <div className="text-center mt-2">
                <p
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-[#0047FF] font-bold" : "text-slate-800"
                  }`}
                >
                  {stage.stage_name}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {stage.stage_date || "--"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
