import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../services/api";

export default function AdminDashboard({
  currentPath,
  navigateTo,
  onLogout,
  competitionSettings,
  setCompetitionSettings,
}) {
  const [stats, setStats] = useState({
    users: 0,
    teams: 0,
    challenges: 0,
    submissions: 0,
    solvedFlags: 0,
    activeTeams: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);
  const [localCompetition, setLocalCompetition] = useState(competitionSettings);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [usersRes, teamsRes, challengesRes, submissionsRes, competitionRes] =
        await Promise.all([
          api.admin.getUsers(),
          api.admin.getTeams(),
          api.admin.getChallenges(),
          api.admin.getSubmissions(),
          api.admin.getCompetition(),
        ]);

      const users = usersRes.users || [];
      const teams = teamsRes.teams || [];
      const challenges = challengesRes.challenges || [];
      const submissions = submissionsRes.submissions || [];
      const competition = competitionRes.competition || null;

      const solvedFlags = submissions.filter((s) => s.correct === true).length;
      const teamsWithActivity = new Set(
        submissions
          .filter((s) => s.correct === true && s.team)
          .map((s) => (typeof s.team === "object" ? s.team._id : s.team))
      );

      setStats({
        users: users.length,
        teams: teams.length,
        challenges: challenges.length,
        submissions: submissions.length,
        solvedFlags,
        activeTeams: teamsWithActivity.size,
      });

      setRecentSubmissions(submissions.slice(0, 4));

      if (competition) {
        setLocalCompetition(competition);
        if (setCompetitionSettings) setCompetitionSettings(competition);
      }
    } catch (err) {
      console.error("[ADMIN DASHBOARD] Fetch error:", err.message);
      setErrorMsg(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (competitionSettings) {
      setLocalCompetition(competitionSettings);
    }
  }, [competitionSettings]);

  useEffect(() => {
    const endTime = localCompetition?.endTime;
    if (!endTime) {
      setSecondsLeft(0);
      return;
    }

    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((new Date(endTime).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [localCompetition?.endTime]);

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

  const statCards = [
    { label: "REGISTERED USERS", value: stats.users, color: "text-[#F5F5F5]" },
    { label: "TEAMS", value: stats.teams, color: "text-[#F5F5F5]" },
    { label: "CHALLENGES", value: stats.challenges, color: "text-[#F5F5F5]" },
    { label: "SUBMISSIONS", value: stats.submissions, color: "text-[#39FF14]" },
    { label: "SOLVED FLAGS", value: stats.solvedFlags, color: "text-[#39FF14]" },
    { label: "ACTIVE TEAMS", value: stats.activeTeams, color: "text-[#39FF14]" },
  ];

  const status = localCompetition?.status || "UPCOMING";
  const isLive = status === "LIVE";

  const handleToggleCompetition = async (newStatus) => {
    setStatusUpdating(true);
    setErrorMsg(null);
    try {
      const res = await api.admin.updateCompetition({ status: newStatus });
      if (res.competition) {
        setLocalCompetition(res.competition);
        if (setCompetitionSettings) setCompetitionSettings(res.competition);
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to update competition status.");
    } finally {
      setStatusUpdating(false);
    }
  };

  const formatSubmissionTime = (sub) => {
    const ts = sub.submittedAt || sub.createdAt;
    if (!ts) return "N/A";
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
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

        <button
          onClick={() => navigateTo("/")}
          className="self-start md:self-auto px-4 py-2 bg-[#111111] text-[#39FF14] border border-[#39FF14]/40 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#39FF14] hover:text-[#080808] transition-all cursor-pointer"
        >
          VIEW PARTICIPANT SITE &rarr;
        </button>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

      {/* 2. Statistic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((s, idx) => (
          <div
            key={idx}
            className="bg-[#111111] border border-[#242424] p-4 rounded-sm hover:border-[#39FF14]/40 transition-colors"
          >
            <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1">
              {s.label}
            </span>
            <div className={`text-2xl sm:text-3xl font-minecraftBold ${s.color}`}>
              {loading ? "—" : s.value}
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
                  : status === "ENDED"
                    ? "bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/40"
                    : "bg-[#8A8A8A]/10 text-[#8A8A8A] border-[#242424]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? "bg-[#39FF14] animate-ping" : status === "ENDED" ? "bg-[#FF4D4D]" : "bg-[#8A8A8A]"
                }`}
              />
              <span>● {status}</span>
            </span>
          </div>

          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={() => handleToggleCompetition("LIVE")}
              disabled={isLive || statusUpdating}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                isLive
                  ? "bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14]/40 cursor-not-allowed"
                  : "bg-[#39FF14] text-[#080808] hover:bg-[#39FF14]/90 disabled:opacity-50"
              }`}
            >
              START COMPETITION
            </button>
            <button
              onClick={() => handleToggleCompetition("ENDED")}
              disabled={status === "ENDED" || statusUpdating}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                status === "ENDED"
                  ? "bg-[#242424] text-[#8A8A8A] cursor-not-allowed"
                  : "bg-[#080808] text-[#FF4D4D] border border-[#FF4D4D]/50 hover:bg-[#FF4D4D] hover:text-[#080808] disabled:opacity-50"
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
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; LOADING SUBMISSIONS...
                  </td>
                </tr>
              ) : recentSubmissions.length > 0 ? (
                recentSubmissions.map((sub) => {
                  const teamName =
                    typeof sub.team === "object" ? sub.team?.name || "N/A" : "N/A";
                  const challengeTitle =
                    typeof sub.challenge === "object" ? sub.challenge?.title || "N/A" : "N/A";
                  const isCorrect = sub.correct === true;

                  return (
                    <tr key={sub._id} className="hover:bg-[#080808]/50">
                      <td className="py-3 px-4 font-bold text-[#F5F5F5]">{teamName}</td>
                      <td className="py-3 px-4 text-[#8A8A8A]">{challengeTitle}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCorrect
                              ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                              : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                          }`}
                        >
                          {isCorrect ? "CORRECT" : "INCORRECT"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-[#8A8A8A] font-mono">
                        {formatSubmissionTime(sub)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#8A8A8A]">
                    No submissions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
