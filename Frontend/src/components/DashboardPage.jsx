import React, { useState, useEffect } from "react";
import { api } from "../services/api";

export default function DashboardPage({ userTeam, navigateTo, showToast, currentUser }) {
  const [liveTeam, setLiveTeam] = useState(userTeam || null);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalChallengesCount, setTotalChallengesCount] = useState(0);
  const [leaderboardRank, setLeaderboardRank] = useState("-");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [competitionStatus, setCompetitionStatus] = useState("LIVE");
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [teamRes, challengesRes, solvedRes, leaderboardRes, compRes] =
          await Promise.allSettled([
            api.teams.getMyTeam(),
            api.challenges.getAll(),
            api.challenges.getSolved(),
            api.leaderboard.get(),
            api.competition.get(),
          ]);

        if (teamRes.status === "fulfilled" && teamRes.value?.team) {
          setLiveTeam(teamRes.value.team);
        }

        if (challengesRes.status === "fulfilled" && challengesRes.value?.challenges) {
          setTotalChallengesCount(challengesRes.value.challenges.length);
        }

        if (solvedRes.status === "fulfilled" && solvedRes.value?.solvedChallengeIds) {
          setSolvedCount(solvedRes.value.solvedChallengeIds.length);
        }

        if (leaderboardRes.status === "fulfilled" && leaderboardRes.value?.leaderboard) {
          const lb = leaderboardRes.value.leaderboard;
          const myTeamName = teamRes.status === "fulfilled"
            ? teamRes.value?.team?.name
            : userTeam?.name;
          const entry = lb.find((item) => item.team === myTeamName);
          if (entry) {
            setLeaderboardRank(entry.rank);
          }
        }

        if (compRes.status === "fulfilled" && compRes.value) {
          const comp = compRes.value;
          setCompetitionStatus(comp.activeState || comp.status);
          if (comp.endTime) {
            const diff = Math.max(
              0,
              Math.floor((new Date(comp.endTime).getTime() - Date.now()) / 1000)
            );
            setSecondsLeft(diff);
          }
        }
      } catch (err) {
        console.log("[DASHBOARD] Fetch live data error:", err.message);
      }
    }
    fetchDashboardData();
  }, [userTeam]);

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

  const handleCopyCode = (codeToCopy) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    if (showToast) showToast("Team code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const teamName = liveTeam?.name || userTeam?.name || "No Team";
  const teamCode = liveTeam?.code || userTeam?.code || "—";
  const teamScore = liveTeam?.score !== undefined ? liveTeam.score : 0;
  const membersList = liveTeam?.members || [];
  const membersCount = Array.isArray(membersList) ? membersList.length : 0;

  const isEnded = competitionStatus === "ENDED";
  const isUpcoming = competitionStatus === "NOT_STARTED";

  const progressPercentage = totalChallengesCount > 0
    ? Math.round((solvedCount / totalChallengesCount) * 100)
    : 0;

  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-8">
        {/* 1. DASHBOARD HEADER */}
        <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-6 box-glow-neon">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#39FF14] mb-2 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span>CONTROL PANEL // DASHBOARD</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
              WELCOME BACK, {(currentUser?.username || currentUser?.name || "REYU").toUpperCase()}
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              Your team is ready. Start solving challenges and capture the flag.
            </p>
          </div>

          <div className="bg-[#080808] border border-[#242424] px-4 py-3 rounded-sm flex items-center space-x-4 self-start md:self-auto">
            <div className="w-9 h-9 rounded border border-[#39FF14]/40 bg-[#111111] flex items-center justify-center text-[#39FF14]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block">
                CURRENT TEAM
              </span>
              <span className="text-sm font-minecraftBold text-[#39FF14] tracking-wide">
                {teamName}
              </span>
            </div>
          </div>
        </div>

        {/* Terminal Status Line */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8A8A8A] bg-[#111111]/50 border border-[#242424] px-4 py-2 rounded-sm font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>SYSTEM STATUS: <strong className="text-[#39FF14]">ONLINE</strong></span>
          </div>
          <span className="text-[#242424]">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>TEAM CONNECTION: <strong className="text-[#39FF14]">ACTIVE</strong></span>
          </div>
          <span className="text-[#242424]">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>CHALLENGE SERVER: <strong className="text-[#39FF14]">ONLINE</strong></span>
          </div>
        </div>

        {/* 2. STATS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm hover:border-[#39FF14]/50 transition-colors">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
              TEAM SCORE
            </span>
            <div className="text-3xl sm:text-4xl font-minecraftBold text-[#39FF14] text-glow-neon">
              {teamScore}
            </div>
            <span className="text-[10px] text-[#16A34A] block mt-1">Live Backend Score</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm hover:border-[#39FF14]/50 transition-colors">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
              TEAM RANK
            </span>
            <div className="text-3xl sm:text-4xl font-minecraftBold text-[#39FF14] text-glow-neon">
              #{leaderboardRank}
            </div>
            <span className="text-[10px] text-[#16A34A] block mt-1">Leaderboard Ranking</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm hover:border-[#39FF14]/50 transition-colors">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
              SOLVED
            </span>
            <div className="text-3xl sm:text-4xl font-minecraftBold text-[#F5F5F5]">
              {solvedCount}
            </div>
            <span className="text-[10px] text-[#8A8A8A] block mt-1">Flags Captured</span>
          </div>

          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm hover:border-[#39FF14]/50 transition-colors">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
              TOTAL CHALLENGES
            </span>
            <div className="text-3xl sm:text-4xl font-minecraftBold text-[#F5F5F5]">
              {totalChallengesCount}
            </div>
            <span className="text-[10px] text-[#8A8A8A] block mt-1">Available in event</span>
          </div>
        </div>

        {/* 3. MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isEnded ? "bg-[#FF4D4D]" : isUpcoming ? "bg-[#38BDF8]" : "bg-[#39FF14] animate-ping"
                    }`}
                  />
                  <span
                    className={`text-sm font-minecraftBold tracking-wider uppercase ${
                      isEnded ? "text-[#FF4D4D]" : isUpcoming ? "text-[#38BDF8]" : "text-[#39FF14]"
                    }`}
                  >
                    COMPETITION STATUS: ●{" "}
                    {isEnded ? "ENDED" : isUpcoming ? "UPCOMING" : "LIVE"}
                  </span>
                </div>
                <p className="text-xs text-[#8A8A8A]">
                  {isEnded
                    ? "The competition has ended. Thank you for participating."
                    : isUpcoming
                      ? "The competition has not started yet. Check back soon."
                      : "Event is currently active. Submit flags before time runs out."}
                </p>
              </div>

              <div className="bg-[#080808] border border-[#39FF14]/30 px-5 py-3 rounded-sm text-center min-w-[220px]">
                <span className="text-[10px] text-[#8A8A8A] uppercase tracking-widest block mb-1">
                  {isEnded ? "COMPETITION ENDED" : "TIME REMAINING"}
                </span>
                <div
                  className={`text-2xl sm:text-3xl font-minecraftBold tracking-widest ${
                    isEnded ? "text-[#FF4D4D]" : "text-[#39FF14]"
                  }`}
                >
                  {isEnded ? "00 : 00 : 00" : `${timer.hh} : ${timer.mm} : ${timer.ss}`}
                </div>
                {!isEnded && (
                  <div className="flex justify-between text-[9px] text-[#8A8A8A] uppercase tracking-widest mt-1 px-1">
                    <span>HOURS</span>
                    <span>MINUTES</span>
                    <span>SECONDS</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-minecraftBold text-[#F5F5F5] uppercase tracking-wide">
                    TEAM PROGRESS
                  </h3>
                  <p className="text-xs text-[#8A8A8A]">
                    {solvedCount} / {totalChallengesCount} CHALLENGES SOLVED
                  </p>
                </div>
                <span className="text-lg font-minecraftBold text-[#39FF14]">
                  {progressPercentage}% COMPLETE
                </span>
              </div>

              <div className="w-full bg-[#080808] border border-[#242424] h-3 rounded-sm overflow-hidden p-0.5">
                <div
                  className="bg-[#39FF14] h-full rounded-xs transition-all duration-500 shadow-[0_0_10px_#39FF14]"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-4">
              <h3 className="text-base font-minecraftBold text-[#F5F5F5] uppercase tracking-wide border-b border-[#242424] pb-3">
                YOUR TEAM
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#242424]/60">
                  <span className="text-[#8A8A8A]">Team Name</span>
                  <span className="text-[#F5F5F5] font-bold">{teamName}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#242424]/60">
                  <span className="text-[#8A8A8A]">Team Code</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[#39FF14] font-minecraftBold">{teamCode}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(teamCode)}
                      className="text-[10px] text-[#39FF14] border border-[#39FF14]/40 px-2 py-0.5 rounded hover:bg-[#39FF14]/10 transition-colors uppercase cursor-pointer"
                    >
                      {copiedCode ? "COPIED!" : "COPY CODE"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-[#242424]/60">
                  <span className="text-[#8A8A8A]">Your Role</span>
                  <span className="text-[#F5F5F5] font-bold">
                    {liveTeam?.leader === currentUser?.id ? "Team Leader" : "Participant"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="text-[#8A8A8A]">Members</span>
                  <span className="text-[#39FF14] font-bold">
                    {membersCount} / 5
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-3">
              <h3 className="text-base font-minecraftBold text-[#F5F5F5] uppercase tracking-wide border-b border-[#242424] pb-3">
                QUICK ACTIONS
              </h3>

              <button
                type="button"
                onClick={() => navigateTo("/challenges")}
                disabled={isEnded || isUpcoming}
                className="w-full py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isEnded
                  ? "CHALLENGES ENDED"
                  : isUpcoming
                    ? "CHALLENGES NOT YET OPEN"
                    : "VIEW CHALLENGES"}
              </button>

              <button
                type="button"
                onClick={() => navigateTo("/leaderboard")}
                className="w-full py-2.5 bg-[#080808] text-[#F5F5F5] border border-[#39FF14]/50 hover:border-[#39FF14] hover:text-[#39FF14] font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                VIEW LEADERBOARD
              </button>

              <button
                type="button"
                onClick={() => navigateTo("/team")}
                className="w-full py-2.5 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] hover:border-[#8A8A8A] font-bold text-xs uppercase tracking-widest rounded-sm transition-colors cursor-pointer"
              >
                MANAGE TEAM
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
