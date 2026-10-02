"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Filter, Calendar } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { InterviewDetailPane } from "@/components/interviews/InterviewDetailPane";
import {
  LeftListEmptyState,
  RightDetailEmptyState,
} from "@/components/interviews/InterviewsEmptyState";
import { AddInterviewModal } from "@/components/interviews/AddInterviewModal";
import { EditInterviewModal } from "@/components/interviews/EditInterviewModal";
import { DeleteConfirmModal } from "@/components/applications/DeleteConfirmModal";
import { interviewService } from "@/services/interviewService";
import {
  Interview,
  InterviewQuestion,
  InterviewFeedback,
  InterviewTimelineStage,
} from "@/types/database";
import { useAuth } from "@/context/AuthContext";

export default function InterviewsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<"All Interviews" | "Upcoming">("All Interviews");
  const [searchQuery, setSearchQuery] = useState("");
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Detail state
  const [selectedDetails, setSelectedDetails] = useState<{
    interview: Interview | null;
    questions: InterviewQuestion[];
    feedback: InterviewFeedback[];
    timeline: InterviewTimelineStage[];
  }>({
    interview: null,
    questions: [],
    feedback: [],
    timeline: [],
  });

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [interviewToAct, setInterviewToAct] = useState<Interview | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchInterviews = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const list = await interviewService.getInterviews(user.id, {
      type: activeTab === "Upcoming" ? "Upcoming" : undefined,
      search: searchQuery,
    });
    setInterviews(list);

    if (list.length > 0) {
      const targetId =
        selectedId && list.some((i) => i.id === selectedId) ? selectedId : list[0].id;
      setSelectedId(targetId);
      const details = await interviewService.getInterviewDetails(targetId);
      setSelectedDetails(details);
    } else {
      setSelectedId(null);
      setSelectedDetails({
        interview: null,
        questions: [],
        feedback: [],
        timeline: [],
      });
    }
    setLoading(false);
  }, [user?.id, activeTab, searchQuery, selectedId]);

  useEffect(() => {
    if (user?.id) {
      fetchInterviews();
    }
  }, [user?.id, fetchInterviews]);

  const handleSelectInterview = async (id: string) => {
    setSelectedId(id);
    const details = await interviewService.getInterviewDetails(id);
    setSelectedDetails(details);
  };

  const handleOpenEdit = (interview: Interview) => {
    setInterviewToAct(interview);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (interview: Interview) => {
    setInterviewToAct(interview);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (interviewToAct && user?.id) {
      await interviewService.deleteInterview(interviewToAct.id, user.id);
      setIsDeleteOpen(false);
      setInterviewToAct(null);
      fetchInterviews();
    }
  };

  const handleAddQuestion = async (q: string) => {
    if (selectedId && user?.id) {
      await interviewService.addQuestion(selectedId, user.id, q);
      const details = await interviewService.getInterviewDetails(selectedId);
      setSelectedDetails(details);
    }
  };

  const handleSaveNotes = async (notes: string) => {
    if (selectedId && user?.id) {
      await interviewService.saveNotes(selectedId, user.id, notes);
      const details = await interviewService.getInterviewDetails(selectedId);
      setSelectedDetails(details);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-[#0047FF]/20 border-t-[#0047FF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <AppShell title="Interviews">
      <div className="space-y-6">
        {/* Page Subtitle */}
        <div className="-mt-2">
          <p className="text-xs lg:text-sm text-slate-500">
            Track and manage all your job interviews in one place.
          </p>
        </div>

        {/* Master-Detail Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Master Panel (~35% width / col-span-5) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
            {/* Header + Add Interview Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-[#0F172A] text-base">Interviews</h3>
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0047FF] hover:bg-[#0038CC] text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all active:scale-[0.99]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Interview</span>
              </button>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("All Interviews")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "All Interviews"
                    ? "bg-[#EEF2FF] text-[#0047FF]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                All Interviews
              </button>
              <button
                onClick={() => setActiveTab("Upcoming")}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "Upcoming"
                    ? "bg-[#EEF2FF] text-[#0047FF]"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                Upcoming
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by company or role..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <button className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 shrink-0">
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">
              INTERVIEW LIST
            </p>

            {/* List */}
            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="w-5 h-5 border-2 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
              </div>
            ) : interviews.length === 0 ? (
              <LeftListEmptyState onAddInterview={() => setIsAddOpen(true)} />
            ) : (
              <div className="space-y-3">
                {interviews.map((item) => {
                  const isSelected = item.id === selectedId;
                  const companyName = item.applications?.company_name || "Company";

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectInterview(item.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-[#0047FF] bg-white shadow-md ring-1 ring-[#0047FF]/20"
                          : "border-slate-100 bg-white hover:border-slate-300 shadow-sm"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <CompanyLogo name={companyName} size="md" />
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">
                              {companyName}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium">
                              {item.round_title}
                            </p>
                          </div>
                        </div>

                        {/* Status Chip */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                            item.status === "Scheduled"
                              ? "bg-[#FEF3C7] text-[#D97706]"
                              : "bg-[#EFF6FF] text-[#0047FF]"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>
                          {item.interview_date}, {item.interview_time}
                        </span>
                      </div>
                    </div>
                  );
                })}

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-400">
                    Showing 1 to {interviews.length} of {interviews.length} Interviews
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Detail Panel (~65% width / col-span-8) */}
          <div className="lg:col-span-8">
            {selectedDetails.interview ? (
              <InterviewDetailPane
                interview={selectedDetails.interview}
                questions={selectedDetails.questions}
                feedback={selectedDetails.feedback}
                timeline={selectedDetails.timeline}
                onEdit={handleOpenEdit}
                onDelete={handleOpenDelete}
                onAddQuestion={handleAddQuestion}
                onSaveNotes={handleSaveNotes}
              />
            ) : (
              <RightDetailEmptyState onAddInterview={() => setIsAddOpen(true)} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddInterviewModal
        isOpen={isAddOpen}
        userId={user.id}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => fetchInterviews()}
      />

      <EditInterviewModal
        isOpen={isEditOpen}
        userId={user.id}
        interview={interviewToAct}
        onClose={() => {
          setIsEditOpen(false);
          setInterviewToAct(null);
        }}
        onSuccess={() => fetchInterviews()}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Interview"
        description={`Are you sure you want to delete the interview for ${interviewToAct?.applications?.company_name} - ${interviewToAct?.round_title}? Associated reminders will also be cancelled.`}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
}
