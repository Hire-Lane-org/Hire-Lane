"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  Filter,
  MapPin,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ApplicationFilterTabs } from "@/components/applications/ApplicationFilterTabs";
import { ApplicationsEmptyState } from "@/components/applications/ApplicationsEmptyState";
import { AddApplicationModal } from "@/components/applications/AddApplicationModal";
import { EditApplicationModal } from "@/components/applications/EditApplicationModal";
import { ApplicationDetailModal } from "@/components/applications/ApplicationDetailModal";
import { DeleteConfirmModal } from "@/components/applications/DeleteConfirmModal";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Application } from "@/types/database";
import { applicationService } from "@/services/applicationService";
import { formatDate, getDeadlineCountdown } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function ApplicationsContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [applications, setApplications] = useState<Application[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const fetchApplications = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    const res = await applicationService.getApplications(user.id, {
      status: activeTab,
      search: searchQuery,
      page,
      pageSize,
    });
    setApplications(res.data);
    setTotal(res.total);
    setLoading(false);
  }, [user?.id, activeTab, searchQuery, page, pageSize]);

  useEffect(() => {
    if (user?.id) {
      fetchApplications();
    }
  }, [user?.id, fetchApplications]);

  const handleOpenAdd = () => setIsAddOpen(true);

  const handleOpenEdit = (app: Application) => {
    setSelectedApp(app);
    setIsEditOpen(true);
  };

  const handleOpenDetail = (app: Application) => {
    setSelectedApp(app);
    setIsDetailOpen(true);
  };

  const handleOpenDelete = (app: Application) => {
    setSelectedApp(app);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedApp && user?.id) {
      await applicationService.deleteApplication(selectedApp.id, user.id);
      setIsDeleteOpen(false);
      setSelectedApp(null);
      fetchApplications();
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-[#0047FF]/20 border-t-[#0047FF] rounded-full animate-spin" />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <AppShell title="Applications">
      <div className="space-y-6">
        {/* Page Subtitle */}
        <div className="-mt-2">
          <p className="text-xs lg:text-sm text-slate-500">
            Track and manage all your job applications in one place.
          </p>
        </div>

        {/* Filter Pills and CTA */}
        <ApplicationFilterTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
          onAddApplication={handleOpenAdd}
        />

        {/* Main Table Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Search & Filter Toolbar */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-slate-100">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search applications..."
                className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50/70 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400 text-slate-900"
              />
            </div>
            <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Filter</span>
            </button>
          </div>

          {/* Table or Empty State */}
          {loading ? (
            <div className="py-24 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#0047FF]/20 border-t-[#0047FF] rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <ApplicationsEmptyState onAddApplication={handleOpenAdd} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/40">
                    <th className="py-3.5 px-6">COMPANY</th>
                    <th className="py-3.5 px-4">ROLE</th>
                    <th className="py-3.5 px-4">LOCATION</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4">APPLIED DATE</th>
                    <th className="py-3.5 px-4">DEADLINE</th>
                    <th className="py-3.5 px-6 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.map((app) => {
                    const countdown = getDeadlineCountdown(app.deadline);
                    return (
                      <tr
                        key={app.id}
                        className="hover:bg-slate-50/60 transition-colors group"
                      >
                        {/* Company */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <CompanyLogo name={app.company_name} size="md" />
                            <span className="font-bold text-slate-900 text-xs sm:text-sm">
                              {app.company_name}
                            </span>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-4 text-xs font-semibold text-slate-700">
                          {app.role}
                        </td>

                        {/* Location */}
                        <td className="py-4 px-4 text-xs text-slate-500 font-medium">
                          {app.location ? (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              {app.location}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <StatusBadge status={app.status} />
                        </td>

                        {/* Applied Date */}
                        <td className="py-4 px-4 text-xs text-slate-600 font-medium">
                          {formatDate(app.applied_date)}
                        </td>

                        {/* Deadline */}
                        <td className="py-4 px-4 text-xs font-medium">
                          {app.deadline ? (
                            <div>
                              <p className="text-slate-700 font-semibold">
                                {formatDate(app.deadline)}
                              </p>
                              <p
                                className={`text-[11px] font-bold ${
                                   countdown.isUrgent
                                    ? "text-red-500"
                                    : countdown.isWarning
                                    ? "text-amber-500"
                                    : "text-slate-400"
                                }`}
                              >
                                {countdown.text}
                              </p>
                            </div>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenDetail(app)}
                              className="p-1.5 text-slate-400 hover:text-[#0047FF] rounded-lg hover:bg-blue-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(app)}
                              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenDelete(app)}
                              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && applications.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                Showing {Math.min((page - 1) * pageSize + 1, total)} to{" "}
                {Math.min(page * pageSize, total)} of {total} applications
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
                        page === pNum
                          ? "bg-[#0047FF] text-white"
                          : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                {totalPages > 5 && (
                  <>
                    <span className="px-1 text-slate-400 text-xs">...</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 ${
                        page === totalPages ? "bg-[#0047FF] text-white" : ""
                      }`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connected Modals */}
      <AddApplicationModal
        isOpen={isAddOpen}
        userId={user.id}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => fetchApplications()}
      />

      <EditApplicationModal
        isOpen={isEditOpen}
        userId={user.id}
        application={selectedApp}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedApp(null);
        }}
        onSuccess={() => fetchApplications()}
      />

      <ApplicationDetailModal
        isOpen={isDetailOpen}
        application={selectedApp}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedApp(null);
        }}
        onEdit={(app) => {
          setIsDetailOpen(false);
          handleOpenEdit(app);
        }}
        onDelete={(app) => {
          setIsDetailOpen(false);
          handleOpenDelete(app);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        title="Delete Application"
        description={`Are you sure you want to delete the application for ${selectedApp?.company_name} - ${selectedApp?.role}? All linked reminders and interview records will also be safely removed.`}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </AppShell>
  );
}

export default function ApplicationsPage() {
  return (
    <Suspense
      fallback={
        <AppShell title="Applications">
          <div className="py-24 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#0047FF]/20 border-t-[#0047FF] rounded-full animate-spin" />
          </div>
        </AppShell>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}
