import React, { useState, useEffect, useMemo } from "react";
import LeaderboardRow from "./LeaderboardRow";
import { initialLeaderboard } from "../data/leaderboard";
import { api } from "../services/api";

export default function LeaderboardPage({ userTeamName = "Cyber Warriors" }) {
  const [leaderboardData, setLeaderboardData] = useState(initialLeaderboard);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score"); // 'score' | 'solved'
  const [secondsLeft, setSecondsLeft] = useState(9102);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await api.leaderboard.get();
        if (res.leaderboard && res.leaderboard.length > 0) {
          setLeaderboardData(res.leaderboard);
        }
      } catch (err) {
        console.log("[LEADERBOARD PAGE] API fetch error:", err.message);
      }
    }
    fetchLeaderboard();
  }, []);

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

  const processedLeaderboard = useMemo(() => {
    let result = [...leaderboardData];

    if (searchQuery.trim()) {
      result = result.filter((item) =>
        item.team.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    result.sort((a, b) => {
      if (sortBy === "solved") {
        if (b.solved !== a.solved) return b.solved - a.solved;
        return b.score - a.score;
      }
      return b.score - a.score;
    });

    return result;
  }, [leaderboardData, searchQuery, sortBy]);

  const totalTeams = leaderboardData.length;
  const totalSubmissions = leaderboardData.reduce((sum, t) => sum + (t.solved || 0) * 7, 87);

  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#242424] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111111] border border-[#39FF14]/30 rounded-full mb-3 text-xs text-[#39FF14] tracking-widest uppercase shadow-[0_0_10px_rgba(57,255,20,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span>&gt; COMPETITION LIVE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-2">
              LEADERBOARD
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              See who's leading the competition. Keep solving and climb the ranks.
            </p>
          </div>

          <div className="bg-[#111111] border border-[#39FF14]/30 px-6 py-3 rounded-sm text-center self-start md:self-auto min-w-[210px]">
            <span className="text-[10px] text-[#8A8A8A] uppercase tracking-widest block mb-1">
              TIME REMAINING
            </span>
            <div className="text-2xl font-minecraftBold text-[#39FF14] tracking-widest">
              {timer.hh} : {timer.mm} : {timer.ss}
            </div>
            <div className="flex justify-between text-[9px] text-[#8A8A8A] uppercase tracking-widest mt-1 px-1">
              <span>HOURS</span>
              <span>MINUTES</span>
              <span>SECONDS</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#8A8A8A] bg-[#111111]/50 border border-[#242424] px-4 py-2 rounded-sm font-mono">
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>RANKING DATABASE: <strong className="text-[#39FF14]">ONLINE</strong></span>
          </div>
          <span className="text-[#242424]">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>LIVE SCORES: <strong className="text-[#39FF14]">ACTIVE</strong></span>
          </div>
          <span className="text-[#242424]">|</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-[#39FF14]">&gt;</span>
            <span>TEAMS COMPETING: <strong className="text-[#F5F5F5]">{totalTeams}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-1">
                TEAMS
              </span>
              <span className="text-3xl font-minecraftBold text-[#F5F5F5]">{totalTeams}</span>
            </div>
            <div className="w-10 h-10 rounded border border-[#242424] bg-[#080808] flex items-center justify-center text-[#39FF14] text-sm">
              &#128101;
            </div>
          </div>

          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-1">
                CHALLENGES
              </span>
              <span className="text-3xl font-minecraftBold text-[#F5F5F5]">20</span>
            </div>
            <div className="w-10 h-10 rounded border border-[#242424] bg-[#080808] flex items-center justify-center text-[#39FF14] text-sm">
              &#9873;
            </div>
          </div>

          <div className="bg-[#111111] border border-[#242424] p-5 rounded-sm flex items-center justify-between">
            <div>
              <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-1">
                SUBMISSIONS
              </span>
              <span className="text-3xl font-minecraftBold text-[#39FF14]">{totalSubmissions}</span>
            </div>
            <div className="w-10 h-10 rounded border border-[#242424] bg-[#080808] flex items-center justify-center text-[#39FF14] text-sm">
              &#9889;
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 text-xs rounded-sm px-4 py-2.5 outline-none placeholder:text-[#555555] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-[#8A8A8A] hover:text-[#39FF14]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <span className="text-xs text-[#8A8A8A] uppercase tracking-wider">
              SORT BY:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#111111] text-[#39FF14] border border-[#242424] focus:border-[#39FF14] text-xs font-spaceMonoBold rounded-sm px-3 py-2 outline-none cursor-pointer"
            >
              <option value="score">Highest Score</option>
              <option value="solved">Most Challenges Solved</option>
            </select>
          </div>
        </div>

        {processedLeaderboard.length > 0 ? (
          <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="hidden md:table-row bg-[#080808] border-b border-[#242424] text-xs text-[#8A8A8A] uppercase tracking-wider">
                  <th className="px-6 py-3.5">RANK</th>
                  <th className="px-6 py-3.5">TEAM</th>
                  <th className="px-6 py-3.5">SCORE</th>
                  <th className="px-6 py-3.5">SOLVED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242424]/40">
                {processedLeaderboard.map((item) => (
                  <LeaderboardRow
                    key={item.team}
                    teamData={item}
                    userTeamName={userTeamName}
                  />
                ))}
              </tbody>
            </table>

            <div className="md:hidden p-4 space-y-3">
              {processedLeaderboard.map((item) => (
                <LeaderboardRow
                  key={item.team}
                  teamData={item}
                  userTeamName={userTeamName}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#242424] rounded-sm p-12 text-center my-12 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#080808] border border-[#242424] flex items-center justify-center text-[#8A8A8A] mx-auto mb-4 font-minecraftBold">
              !
            </div>
            <h3 className="text-lg font-minecraftBold text-[#F5F5F5] mb-2 uppercase">
              NO TEAMS FOUND
            </h3>
            <p className="text-xs text-[#8A8A8A]">
              Try searching for another team name.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-4 py-2 bg-[#080808] border border-[#39FF14]/50 text-[#39FF14] text-xs uppercase tracking-wider rounded-sm hover:bg-[#39FF14] hover:text-[#080808] transition-all cursor-pointer"
            >
              CLEAR SEARCH
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
