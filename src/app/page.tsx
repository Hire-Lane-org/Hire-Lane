"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { RecentApplicationsCard } from "@/components/dashboard/RecentApplicationsCard";
import { UpcomingInterviewsCard } from "@/components/dashboard/UpcomingInterviewsCard";
import { UpcomingDeadlinesCard } from "@/components/dashboard/UpcomingDeadlinesCard";
import { QuickActionsBar } from "@/components/dashboard/QuickActionsBar";
import { AddApplicationModal } from "@/components/applications/AddApplicationModal";
import { AddInterviewModal } from "@/components/interviews/AddInterviewModal";
import { applicationService } from "@/services/applicationService";
import { interviewService } from "@/services/interviewService";
import { profileService } from "@/services/profileService";
import { Application, Interview, Profile } from "@/types/database";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    deadlines: 0,
    activeApplications: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Modals
  const [isAddAppOpen, setIsAddAppOpen] = useState(false);
  const [isAddInterviewOpen, setIsAddInterviewOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;
    setDataLoading(true);
    try {
      const [userProfile, userStats, appsRes, ints] = await Promise.all([
        profileService.getProfile(user.id, {
          email: user.email,
          full_name: user.full_name,
        }),
        applicationService.getDashboardStats(user.id),
        applicationService.getApplications(user.id, { page: 1, pageSize: 8 }),
        interviewService.getInterviews(user.id, { type: "Upcoming" }),
      ]);

      setProfile(userProfile);
      setStats(userStats);
      setRecentApplications(appsRes.data);
      setUpcomingInterviews(ints);
    } catch (err) {
      console.error("[Dashboard Load Error]", err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id, loadDashboardData]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-8 h-8 border-3 border-[#0047FF]/20 border-t-[#0047FF] rounded-full animate-spin" />
      </div>
    );
  }

  const isEmpty =
    !dataLoading &&
    stats.totalApplications === 0 &&
    stats.interviews === 0 &&
    recentApplications.length === 0;

  const firstName = profile?.full_name
    ? profile.full_name.split(" ")[0]
    : user.full_name
    ? user.full_name.split(" ")[0]
    : user.email?.split("@")[0];

  return (
    <AppShell title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Greeting Banner */}
        <WelcomeBanner
          userName={firstName}
          isEmptyState={isEmpty}
        />

        {/* 4 Metric Statistics Cards */}
        <StatsRow
          totalApplications={stats.totalApplications}
          interviews={stats.interviews}
          deadlines={stats.deadlines}
          activeApplications={stats.activeApplications}
          isEmptyState={isEmpty}
        />

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Recent Applications (Left ~65%) */}
          <div className="lg:col-span-8">
            <RecentApplicationsCard
              applications={recentApplications}
              onAddApplication={() => setIsAddAppOpen(true)}
            />
          </div>

          {/* Side Cards: Interviews & Deadlines (Right ~35%) */}
          <div className="lg:col-span-4 space-y-6">
            <UpcomingInterviewsCard
              interviews={upcomingInterviews}
              onScheduleInterview={() => setIsAddInterviewOpen(true)}
            />
            <UpcomingDeadlinesCard
              applications={recentApplications}
              onAddApplication={() => setIsAddAppOpen(true)}
            />
          </div>
        </div>

        {/* Quick Actions Bar */}
        <QuickActionsBar
          onAddApplication={() => setIsAddAppOpen(true)}
          onAddInterview={() => setIsAddInterviewOpen(true)}
          onUploadResume={() => {
            router.push("/profile");
          }}
          onAddNote={() => {
            router.push("/interviews");
          }}
        />
      </div>

      {/* Modals */}
      <AddApplicationModal
        isOpen={isAddAppOpen}
        userId={user.id}
        onClose={() => setIsAddAppOpen(false)}
        onSuccess={() => loadDashboardData()}
      />

      <AddInterviewModal
        isOpen={isAddInterviewOpen}
        userId={user.id}
        onClose={() => setIsAddInterviewOpen(false)}
        onSuccess={() => loadDashboardData()}
      />
    </AppShell>
  );
}
