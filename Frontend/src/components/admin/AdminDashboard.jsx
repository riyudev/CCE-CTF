import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { initialAdminSubmissions } from "../../data/adminData";

export default function AdminDashboard({
  currentPath,
  navigateTo,
  competitionSettings,
  setCompetitionSettings,
}) {
  const [secondsLeft, setSecondsLeft] = useState(9102); // 2h 31m 42s

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hh: String(hours).padStart(2, "0"),
      mm: String(minutes).padStart(2, "0"),
      ss: String(seconds).padStart(2, "0"),
    };
  };

  const timer = formatTimer(secondsLeft);

  const stats = [
    { label: "REGISTERED USERS", value: "48", color: "text-[#F5F5F5]" },
    { label: "TEAMS", value: "12", color: "text-[#F5F5F5]" },
    { label: "CHALLENGES", value: "20", color: "text-[#F5F5F5]" },
    { label: "SUBMISSIONS", value: "87", color: "text-[#39FF14]" },
    { label: "SOLVED FLAGS", value: "54", color: "text-[#39FF14]" },
    { label: "ACTIVE TEAMS", value: "10", color: "text-[#39FF14]" },
  ];

  const isLive = competitionSettings.status === "LIVE";

  const handleToggleCompetition = (newStatus) => {
    setCompetitionSettings((prev) => ({ ...prev, status: newStatus }));
  };

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo}>
      {/* 1. Header */}
      <div className="border-b border-[#242424] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#39FF14] mb-2 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span>CCE DEPT // ADMIN CONTROL CENTER</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide">
            ADMIN DASHBOARD
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Competition management and monitoring.
          </p>
        </div>

        {/* Quick Nav Button */}
        <button
          onClick={() => navigateTo("/")}
          className="self-start md:self-auto px-4 py-2 bg-[#111111] text-[#39FF14] border border-[#39FF14]/40 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#39FF14] hover:text-[#080808] transition-all cursor-pointer"
        >
          VIEW PARTICIPANT SITE &rarr;
        </button>
      </div>

      {/* 2. 6 Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="bg-[#111111] border border-[#242424] p-4 rounded-sm hover:border-[#39FF14]/40 transition-colors"
          >
            <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1">
              {s.label}
            </span>
            <div className={`text-2xl sm:text-3xl font-minecraftBold ${s.color}`}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Competition Status & Timer Controls Card */}
      <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 box-glow-neon">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-minecraftBold text-[#F5F5F5] uppercase tracking-wide">
              COMPETITION STATUS:
            </span>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full border tracking-widest uppercase inline-flex items-center space-x-1.5 ${
                isLive
                  ? "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]/40"
                  : "bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/40"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-[#39FF14] animate-ping" : "bg-[#FF4D4D]"
                }`}
              />
              <span>● {competitionSettings.status}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={() => handleToggleCompetition("LIVE")}
              disabled={isLive}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                isLive
                  ? "bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40 cursor-not-allowed"
                  : "bg-[#39FF14] text-[#080808] hover:bg-[#39FF14]/90"
              }`}
            >
              START COMPETITION
            </button>
            <button
              onClick={() => handleToggleCompetition("ENDED")}
              disabled={!isLive}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                !isLive
                  ? "bg-[#242424] text-[#8A8A8A] cursor-not-allowed"
                  : "bg-[#080808] text-[#FF4D4D] border border-[#FF4D4D]/50 hover:bg-[#FF4D4D] hover:text-[#080808]"
              }`}
            >
              END COMPETITION
            </button>
          </div>
        </div>

        {/* Timer Box */}
        <div className="bg-[#080808] border border-[#39FF14]/30 px-6 py-3 rounded-sm text-center min-w-[210px]">
          <span className="text-[10px] text-[#8A8A8A] uppercase tracking-widest block mb-1">
            TIME REMAINING
          </span>
          <div className="text-2xl sm:text-3xl font-minecraftBold text-[#39FF14] tracking-widest">
            {timer.hh} : {timer.mm} : {timer.ss}
          </div>
          <div className="flex justify-between text-[9px] text-[#8A8A8A] uppercase tracking-widest mt-1 px-1">
            <span>HOURS</span>
            <span>MINUTES</span>
            <span>SECONDS</span>
          </div>
        </div>
      </div>

      {/* 4. Recent Submissions Section */}
      <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <h3 className="text-base font-minecraftBold text-[#F5F5F5] uppercase tracking-wide">
            RECENT SUBMISSIONS
          </h3>
          <button
            onClick={() => navigateTo("/admin/submissions")}
            className="text-xs text-[#39FF14] hover:underline uppercase tracking-wider"
          >
            VIEW ALL SUBMISSIONS &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3 px-4">TEAM</th>
                <th className="py-3 px-4">CHALLENGE</th>
                <th className="py-3 px-4">RESULT</th>
                <th className="py-3 px-4 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {initialAdminSubmissions.slice(0, 4).map((sub) => (
                <tr key={sub.id} className="hover:bg-[#080808]/50">
                  <td className="py-3 px-4 font-bold text-[#F5F5F5]">{sub.team}</td>
                  <td className="py-3 px-4 text-[#8A8A8A]">{sub.challenge}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        sub.result === "CORRECT"
                          ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                          : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                      }`}
                    >
                      {sub.result}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-[#8A8A8A] font-mono">
                    {sub.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
