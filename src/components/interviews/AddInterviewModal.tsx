"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  Laptop,
  Link as LinkIcon,
  MapPin,
  FileText,
  Upload,
  Save,
  Bell,
  Flag,
  User,
} from "lucide-react";
import { Application, Interview, Resume } from "@/types/database";
import { applicationService } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";
import { resumeService } from "@/services/resumeService";

interface AddInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newInt: Interview) => void;
  userId?: string;
  defaultApplicationId?: string;
}

export const AddInterviewModal: React.FC<AddInterviewModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId = "",
  defaultApplicationId,
}) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedAppId, setSelectedAppId] = useState(defaultApplicationId || "");
  const [roundTitle, setRoundTitle] = useState("");
  const [interviewers, setInterviewers] = useState<string[]>([]);
  const [newInterviewer, setNewInterviewer] = useState("");
  const [interviewDate, setInterviewDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [interviewTime, setInterviewTime] = useState("10:00 AM");
  const [duration, setDuration] = useState(60);
  const [mode, setMode] = useState("Virtual (Google Meet)");
  const [meetingLink, setMeetingLink] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [prepNotes, setPrepNotes] = useState("");
  const [reminder, setReminder] = useState("30 minutes before");
  const [outcome, setOutcome] = useState("Pending");

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      applicationService.getApplications(userId, { pageSize: 50 }).then((res) => {
        setApplications(res.data);
        if (!selectedAppId && res.data.length > 0) {
          setSelectedAppId(res.data[0].id);
        }
      });
      resumeService.getResumes(userId).then((list) => {
        setResumes(list);
        if (list.length > 0) setSelectedResumeId(list[0].id);
      });
    }
  }, [isOpen, userId, selectedAppId]);

  const handleAddInterviewer = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newInterviewer.trim()) {
      e.preventDefault();
      if (!interviewers.includes(newInterviewer.trim())) {
        setInterviewers([...interviewers, newInterviewer.trim()]);
      }
      setNewInterviewer("");
    }
  };

  const handleRemoveInterviewer = (name: string) => {
    setInterviewers(interviewers.filter((n) => n !== name));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedAppId) {
      setError("Please select a linked job application.");
      return;
    }
    if (!roundTitle.trim()) {
      setError("Please enter the interview round title.");
      return;
    }

    setLoading(true);

    try {
      const chosenApp = applications.find((a) => a.id === selectedAppId);

      const created = await interviewService.createInterview(userId, {
        application_id: selectedAppId,
        round_title: roundTitle.trim(),
        interviewers,
        interview_date: interviewDate,
        interview_time: interviewTime,
        duration_minutes: duration,
        mode,
        meeting_link: meetingLink.trim() || null,
        venue: venue.trim() || null,
        description: description.trim() || null,
        resume_id: selectedResumeId || null,
        preparation_notes: prepNotes.trim() || null,
        reminder_offset: reminder,
        outcome,
        status: "Upcoming",
        applications: chosenApp,
      });

      if (created) {
        onSuccess(created);
        onClose();
      } else {
        setError("Failed to create interview. Please check your input.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentResume = resumes.find((r) => r.id === selectedResumeId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Add New Interview
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Schedule and track your interview details.
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

          {/* Row 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Application <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium"
              >
                {applications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.company_name} - {app.role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Round / Interview Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={roundTitle}
                onChange={(e) => setRoundTitle(e.target.value)}
                placeholder="e.g. Technical Round"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          {/* Row 2: Interviewers Tags & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Interviewers <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-xl min-h-[42px]">
                {interviewers.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{name}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterviewer(name)}
                      className="text-slate-400 hover:text-slate-600 ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newInterviewer}
                  onChange={(e) => setNewInterviewer(e.target.value)}
                  onKeyDown={handleAddInterviewer}
                  placeholder={interviewers.length === 0 ? "Type name & press enter" : "Add..."}
                  className="flex-1 min-w-[80px] text-xs bg-transparent border-none focus:outline-none text-slate-900 px-1"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Interview Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Interview Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={interviewTime}
                  onChange={(e) => setInterviewTime(e.target.value)}
                  placeholder="e.g. 10:00 AM"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>120 minutes</option>
              </select>
            </div>
          </div>

          {/* Row 4: Mode & Meeting Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Laptop className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                >
                  <option value="Virtual (Google Meet)">Virtual (Google Meet)</option>
                  <option value="Virtual (Zoom)">Virtual (Zoom)</option>
                  <option value="Virtual (Microsoft Teams)">Virtual (Microsoft Teams)</option>
                  <option value="In-person (Office)">In-person (Office)</option>
                  <option value="Phone Call">Phone Call</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Meeting Link
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="meet.google.com/abc-defg-hij"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Row 5: Venue */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Location / Venue (If Offline)
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g. Office address, Room number"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>

          {/* Row 6: Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Interview Description / Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any additional notes about the interview..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900 resize-none"
            />
          </div>

          {/* Row 7: Resume Used & Preparation Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Resume Used (Optional)
              </label>
              {currentResume ? (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-900 truncate max-w-[140px]">
                        {currentResume.file_name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {(currentResume.file_size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedResumeId("")}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="">Select Resume</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.file_name} {r.is_default ? "(Default)" : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preparation Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={prepNotes}
                onChange={(e) => setPrepNotes(e.target.value)}
                placeholder="Add preparation notes, topics to focus on..."
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 resize-none"
              />
            </div>
          </div>

          {/* Row 8: Reminder & Outcome */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Reminder (Optional)
              </label>
              <div className="relative">
                <Bell className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={reminder}
                  onChange={(e) => setReminder(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                >
                  <option value="15 minutes before">15 minutes before</option>
                  <option value="30 minutes before">30 minutes before</option>
                  <option value="1 hour before">1 hour before</option>
                  <option value="1 day before">1 day before</option>
                  <option value="none">No reminder</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Interview Outcome (After Interview)
              </label>
              <div className="relative">
                <Flag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                >
                  <option value="Pending">Select outcome (Pending)</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
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
                "Add Interview"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
