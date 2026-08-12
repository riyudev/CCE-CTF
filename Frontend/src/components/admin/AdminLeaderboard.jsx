import React from "react";
import AdminLayout from "./AdminLayout";
import LeaderboardPage from "../LeaderboardPage";

export default function AdminLeaderboard({ currentPath, navigateTo }) {
  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo}>
      <div className="border-b border-[#242424] pb-6 mb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          LEADERBOARD MONITORING
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Real-time competition ranking inspection.
        </p>
      </div>

      <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm">
        <LeaderboardPage userTeamName="Cyber Warriors" />
      </div>
    </AdminLayout>
  );
}
