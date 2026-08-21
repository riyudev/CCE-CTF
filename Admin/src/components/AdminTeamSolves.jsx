import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

const CATEGORIES = ["ALL", "WEB", "CRYPTO", "FORENSICS", "REVERSE", "MISC"];
const DIFFICULTIES = ["ALL", "EASY", "MEDIUM", "HARD"];

const getCategoryBadgeClass = (category) => {
  switch (category?.toUpperCase()) {
    case "WEB":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    case "CRYPTO":
      return "bg-purple-500/10 text-purple-400 border-purple-500/30";
    case "FORENSICS":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "REVERSE":
      return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    case "MISC":
    default:
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
  }
};

const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toUpperCase()) {
    case "EASY":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "MEDIUM":
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "HARD":
      return "bg-red-500/10 text-red-400 border-red-500/30";
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/30";
  }
};

export default function AdminTeamSolves({ currentPath, navigateTo, onLogout }) {
  const [teams, setTeams] = useState([]);
  const [stats, setStats] = useState({ totalTeams: 0, totalSolves: 0, categoryStats: {}, difficultyStats: {} });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [expandedTeams, setExpandedTeams] = useState({});
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTeamSolves = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.admin.getTeamSolves();
      if (res.teams) {
        setTeams(res.teams);
        if (res.stats) setStats(res.stats);
        
        // Expand all teams by default if teams count is small
        const initialExpanded = {};
        res.teams.forEach((t) => {
          initialExpanded[t._id] = true;
        });
        setExpandedTeams(initialExpanded);
      }
    } catch (err) {
      console.error("[ADMIN TEAM SOLVES] Error fetching data:", err.message);
      setErrorMsg(err.message || "Failed to load team solved challenges.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamSolves();
  }, []);

  const toggleTeamExpand = (teamId) => {
    setExpandedTeams((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const toggleAllExpanded = (expand) => {
    const nextState = {};
    teams.forEach((t) => {
      nextState[t._id] = expand;
    });
    setExpandedTeams(nextState);
  };

  const isAllExpanded = teams.length > 0 && teams.every((t) => expandedTeams[t._id]);

  // Filter team solves based on search query, category, and difficulty
  const filteredTeams = teams.map((team) => {
    const q = searchQuery.toLowerCase().trim();
    const leaderName = typeof team.leader === "object" ? team.leader?.username || team.leader?.name || "" : "";
    const matchesTeamInfo =
      (team.name || "").toLowerCase().includes(q) ||
      (team.code || "").toLowerCase().includes(q) ||
      leaderName.toLowerCase().includes(q);

    const filteredSolves = (team.solves || []).filter((solve) => {
      const matchCategory = selectedCategory === "ALL" || solve.category?.toUpperCase() === selectedCategory;
      const matchDifficulty = selectedDifficulty === "ALL" || solve.difficulty?.toUpperCase() === selectedDifficulty;
      
      const solverUsername = solve.solvedBy?.username || solve.solvedBy?.name || "";
      const matchSearch =
        matchesTeamInfo ||
        (solve.title || "").toLowerCase().includes(q) ||
        solverUsername.toLowerCase().includes(q);

      return matchCategory && matchDifficulty && matchSearch;
    });

    return {
      ...team,
      displaySolves: filteredSolves,
      matchesFilter: matchesTeamInfo || filteredSolves.length > 0,
    };
  }).filter((team) => team.matchesFilter || searchQuery === "");

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      {/* Page Header */}
      <div className="border-b border-[#242424] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1 flex items-center gap-3">
            <span>TEAMS & SOLVED CHALLENGES</span>
            <span className="text-xs bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/40 px-2.5 py-0.5 rounded font-mono">
              LIVE SOLVES
            </span>
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Monitor active competing teams and inspect their solved challenges broken down by category and difficulty.
          </p>
        </div>

        <button
          onClick={fetchTeamSolves}
          className="px-3 py-2 bg-[#111111] hover:bg-[#1a1a1a] text-[#39FF14] border border-[#39FF14]/40 text-xs font-bold uppercase rounded-sm transition-all flex items-center space-x-2 cursor-pointer self-start md:self-auto"
        >
          <span>↻ REFRESH SOLVES</span>
        </button>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; ERROR: {errorMsg}
        </div>
      )}

      {/* Overview Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm box-glow-neon">
          <div className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider">TOTAL COMPETING TEAMS</div>
          <div className="text-2xl font-minecraftBold text-[#39FF14] mt-1">{stats.totalTeams}</div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm box-glow-neon">
          <div className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider">TOTAL CORRECT SOLVES</div>
          <div className="text-2xl font-minecraftBold text-[#F5F5F5] mt-1">{stats.totalSolves}</div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm box-glow-neon">
          <div className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1.5">SOLVES BY CATEGORY</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(stats.categoryStats || {}).length > 0 ? (
              Object.entries(stats.categoryStats).map(([cat, count]) => (
                <span
                  key={cat}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(cat)}`}
                >
                  {cat}: {count}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#555555]">No solves yet</span>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm box-glow-neon">
          <div className="text-[10px] text-[#8A8A8A] uppercase font-bold tracking-wider mb-1.5">SOLVES BY DIFFICULTY</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.keys(stats.difficultyStats || {}).length > 0 ? (
              Object.entries(stats.difficultyStats).map(([diff, count]) => (
                <span
                  key={diff}
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${getDifficultyBadgeClass(diff)}`}
                >
                  {diff}: {count}
                </span>
              ))
            ) : (
              <span className="text-xs text-[#555555]">No solves yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-[#242424] p-4 rounded-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by team name, code, leader, solver, or challenge title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] text-xs rounded-sm px-4 py-2.5 outline-none placeholder:text-[#555555]"
            />
          </div>

          {/* Toggle Expand All */}
          <button
            onClick={() => toggleAllExpanded(!isAllExpanded)}
            className="px-3 py-2 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] text-xs uppercase font-bold rounded-sm transition-all cursor-pointer shrink-0"
          >
            {isAllExpanded ? "▲ COLLAPSE ALL TEAMS" : "▼ EXPAND ALL TEAMS"}
          </button>
        </div>

        {/* Category & Difficulty Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#242424]">
          {/* Category Pills */}
          <div className="space-y-1">
            <div className="text-[10px] text-[#8A8A8A] uppercase font-bold">Category Filter:</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-sm border transition-all cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-[#39FF14] text-[#080808] border-[#39FF14]"
                      : "bg-[#080808] text-[#8A8A8A] border-[#242424] hover:text-[#F5F5F5]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Pills */}
          <div className="space-y-1">
            <div className="text-[10px] text-[#8A8A8A] uppercase font-bold">Difficulty Filter:</div>
            <div className="flex flex-wrap items-center gap-1.5">
              {DIFFICULTIES.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-sm border transition-all cursor-pointer ${
                    selectedDifficulty === diff
                      ? "bg-[#39FF14] text-[#080808] border-[#39FF14]"
                      : "bg-[#080808] text-[#8A8A8A] border-[#242424] hover:text-[#F5F5F5]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teams Accordion List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-[#111111] border border-[#242424] p-12 text-center text-[#39FF14] font-mono rounded-sm">
            &gt; FETCHING TEAMS AND SOLVED CHALLENGES...
          </div>
        ) : filteredTeams.length > 0 ? (
          filteredTeams.map((team) => {
            const isExpanded = Boolean(expandedTeams[team._id]);
            const leaderName = typeof team.leader === "object" ? team.leader?.username || team.leader?.name || "N/A" : "N/A";
            const memberCount = Array.isArray(team.members) ? team.members.length : 1;
            const solvesList = team.displaySolves || [];

            return (
              <div
                key={team._id}
                className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden transition-all box-glow-neon"
              >
                {/* Team Card Header */}
                <div
                  onClick={() => toggleTeamExpand(team._id)}
                  className="p-4 bg-[#080808]/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-[#080808] transition-colors border-b border-[#242424]/60"
                >
                  <div className="flex items-center space-x-3">
                    <button className="text-[#39FF14] font-mono text-sm">
                      {isExpanded ? "▼" : "►"}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-minecraftBold text-base text-[#39FF14]">{team.name}</span>
                        <span className="text-[10px] font-mono text-[#8A8A8A] bg-[#111111] px-2 py-0.5 rounded border border-[#242424]">
                          {team.code}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8A8A8A] mt-0.5">
                        Leader: <span className="text-[#F5F5F5]">@{leaderName}</span> • Members:{" "}
                        <span className="text-[#F5F5F5]">{memberCount} / 5</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 self-end sm:self-auto">
                    {/* Category pills breakdown summary */}
                    <div className="hidden lg:flex items-center space-x-1.5">
                      {Object.entries(team.categoryBreakdown || {}).map(([cat, cnt]) => (
                        <span key={cat} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${getCategoryBadgeClass(cat)}`}>
                          {cat}:{cnt}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="px-2.5 py-1 bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 rounded text-xs font-mono font-bold">
                        {team.solvesCount || 0} Solved
                      </span>
                      <span className="text-sm font-minecraftBold text-[#39FF14]">
                        {team.score || 0} PTS
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Card Solved Challenges Body */}
                {isExpanded && (
                  <div className="p-4 space-y-3">
                    {solvesList.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                        {solvesList.map((solve, idx) => {
                          const solvedDateStr = solve.solvedAt
                            ? new Date(solve.solvedAt).toLocaleString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "N/A";

                          return (
                            <div
                              key={solve.submissionId || idx}
                              className="bg-[#080808] border border-[#242424] p-3 rounded-sm flex flex-col justify-between space-y-2.5 hover:border-[#39FF14]/50 transition-all"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <h4 className="font-bold text-xs text-[#F5F5F5] leading-tight">
                                  {solve.title}
                                </h4>
                                <span className="font-minecraftBold text-xs text-[#39FF14] shrink-0">
                                  +{solve.points} PTS
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getCategoryBadgeClass(
                                    solve.category
                                  )}`}
                                >
                                  {solve.category}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadgeClass(
                                    solve.difficulty
                                  )}`}
                                >
                                  {solve.difficulty}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-[10px] text-[#8A8A8A] pt-2 border-t border-[#242424]/40 font-mono">
                                <div>
                                  Solved by:{" "}
                                  <span className="text-[#39FF14] font-bold">
                                    @{solve.solvedBy?.username || solve.solvedBy?.name || "Team"}
                                  </span>
                                </div>
                                <div>{solvedDateStr}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-6 text-center text-xs text-[#555555] bg-[#080808] rounded border border-[#242424]">
                        {team.solvesCount === 0
                          ? "This team has not solved any challenges yet."
                          : "No solved challenges match the current filter selection."}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-[#111111] border border-[#242424] p-8 text-center text-[#8A8A8A] text-xs rounded-sm">
            No competing teams found matching search criteria.
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
