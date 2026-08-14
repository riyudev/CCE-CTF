import React from "react";
import AdminLayout from "./AdminLayout";
import LeaderboardPage from "../LeaderboardPage";

export default function AdminLeaderboard({ currentPath, navigateTo, onLogout }) {
  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          LEADERBOARD MONITORING
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Real-time competition ranking from the database.
        </p>
      </div>

      <LeaderboardPage embedded />
    </AdminLayout>
  );
}
