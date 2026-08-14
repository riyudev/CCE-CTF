import React, { useState, useMemo, useEffect } from "react";
import ChallengeCard from "./ChallengeCard";
import { api } from "../services/api";

export default function ChallengesPage({ navigateTo }) {
  const [liveChallenges, setLiveChallenges] = useState([]);
  const [solvedIds, setSolvedIds] = useState([]);
  const [competitionState, setCompetitionState] = useState(null);
  const [blockedMessage, setBlockedMessage] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = ["ALL", "WEB", "CRYPTO", "FORENSICS", "REVERSE", "MISC"];

  useEffect(() => {
    async function loadChallengesData() {
      setLoading(true);
      try {
        const cRes = await api.challenges.getAll();

        if (cRes.competitionState) {
          setCompetitionState(cRes.competitionState);
        }
        if (cRes.message) {
          setBlockedMessage(cRes.message);
        }

        if (cRes.challenges) {
          setLiveChallenges(cRes.challenges);
        }

        try {
          const sRes = await api.challenges.getSolved();
          if (sRes.solvedChallengeIds) {
            setSolvedIds(sRes.solvedChallengeIds);
          }
        } catch {
          // User may not be logged in — solved list optional
        }
      } catch (err) {
        console.log("[CHALLENGES PAGE] Load Error:", err.message);
      } finally {
        setLoading(false);
      }
    }
    loadChallengesData();
  }, []);

  const isBlocked =
    competitionState === "ENDED" || competitionState === "NOT_STARTED";

  const mergedChallenges = useMemo(() => {
    return liveChallenges.map((c) => ({
      ...c,
      solved: c.solved || solvedIds.includes(String(c._id || c.id)),
    }));
  }, [liveChallenges, solvedIds]);

  const filteredChallenges = useMemo(() => {
    return mergedChallenges.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" ||
        item.category.toUpperCase() === selectedCategory.toUpperCase();
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [mergedChallenges, selectedCategory, searchQuery]);

  const solvedCount = mergedChallenges.filter((c) => c.solved).length;
  const availableCount = mergedChallenges.length;
  const totalPoints = mergedChallenges
    .filter((c) => c.solved)
    .reduce((sum, c) => sum + c.points, 0);

  if (loading) {
    return (
      <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
        <div className="relative max-w-7xl mx-auto z-10 text-center py-24">
          <p className="text-xs text-[#39FF14] font-mono">&gt; LOADING CHALLENGES...</p>
        </div>
      </section>
    );
  }

  if (isBlocked) {
    const isEnded = competitionState === "ENDED";
    return (
      <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

        <div className="relative max-w-2xl mx-auto z-10 py-24">
          <div
            className={`bg-[#111111] border rounded-sm p-10 text-center space-y-4 ${
              isEnded ? "border-[#FF4D4D]/40" : "border-[#38BDF8]/40"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-2xl font-minecraftBold border ${
                isEnded
                  ? "border-[#FF4D4D]/40 text-[#FF4D4D] bg-[#FF4D4D]/10"
                  : "border-[#38BDF8]/40 text-[#38BDF8] bg-[#38BDF8]/10"
              }`}
            >
              {isEnded ? "✕" : "◷"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide uppercase">
              {isEnded ? "CCE CTF CHALLENGES ENDED" : "CCE CTF COMPETITION UPCOMING"}
            </h1>
            <p className="text-sm text-[#8A8A8A] leading-relaxed max-w-md mx-auto">
              {blockedMessage ||
                (isEnded
                  ? "Thank you for participating. Challenges are no longer available."
                  : "The competition has not started yet. Check back when the event goes live.")}
            </p>
            <button
              onClick={() => navigateTo("/leaderboard")}
              className="mt-4 px-6 py-2.5 bg-[#080808] text-[#39FF14] border border-[#39FF14]/50 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#39FF14] hover:text-[#080808] transition-all cursor-pointer"
            >
              VIEW LEADERBOARD
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242424] pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111111] border border-[#39FF14]/30 rounded-full mb-3 text-xs text-[#39FF14] tracking-widest uppercase shadow-[0_0_10px_rgba(57,255,20,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
              <span>&gt; {availableCount} CHALLENGES AVAILABLE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-2">
              CHALLENGES
            </h1>
            <p className="text-xs sm:text-sm text-[#8A8A8A]">
              Find the flags. Solve the challenges. Help your team climb the leaderboard.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-[#111111] border border-[#242424] px-4 py-3 rounded-sm self-start sm:self-auto font-spaceMonoBold text-xs">
            <div className="text-center px-2 border-r border-[#242424]">
              <span className="text-[#8A8A8A] block text-[10px] uppercase">SOLVED</span>
              <span className="text-lg font-minecraftBold text-[#39FF14]">{solvedCount}</span>
            </div>
            <div className="text-center px-2 border-r border-[#242424]">
              <span className="text-[#8A8A8A] block text-[10px] uppercase">AVAILABLE</span>
              <span className="text-lg font-minecraftBold text-[#F5F5F5]">{availableCount}</span>
            </div>
            <div className="text-center px-2">
              <span className="text-[#8A8A8A] block text-[10px] uppercase">POINTS</span>
              <span className="text-lg font-minecraftBold text-[#39FF14]">{totalPoints}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 rounded-sm px-4 py-2.5 text-xs outline-none placeholder:text-[#555555] transition-colors"
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

            <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2 text-xs uppercase tracking-wider rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? "bg-[#39FF14] text-[#080808] font-bold shadow-[0_0_10px_rgba(57,255,20,0.3)]"
                        : "bg-[#111111] text-[#8A8A8A] border border-[#242424] hover:border-[#39FF14]/50 hover:text-[#F5F5F5]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {filteredChallenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChallenges.map((item) => (
              <ChallengeCard
                key={item._id || item.id}
                challenge={item}
                onClick={() => navigateTo(`/challenges/${item._id || item.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-[#111111] border border-[#242424] rounded-sm p-12 text-center my-12 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#080808] border border-[#242424] flex items-center justify-center text-[#8A8A8A] mx-auto mb-4 font-minecraftBold">
              !
            </div>
            <h3 className="text-lg font-minecraftBold text-[#F5F5F5] mb-2 uppercase">
              NO CHALLENGES FOUND
            </h3>
            <p className="text-xs text-[#8A8A8A]">
              Try another category or search term.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("ALL");
                setSearchQuery("");
              }}
              className="mt-6 px-4 py-2 bg-[#080808] border border-[#39FF14]/50 text-[#39FF14] text-xs uppercase tracking-wider rounded-sm hover:bg-[#39FF14] hover:text-[#080808] transition-all cursor-pointer"
            >
              RESET FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
