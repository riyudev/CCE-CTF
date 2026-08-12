import React from "react";

export default function ChallengeCard({ challenge, onClick }) {
  const { title, category, difficulty, points, solved } = challenge;

  // Difficulty badge colors
  const difficultyColors = {
    EASY: "border-[#16A34A]/40 text-[#16A34A] bg-[#16A34A]/10",
    MEDIUM: "border-[#EAB308]/40 text-[#EAB308] bg-[#EAB308]/10",
    HARD: "border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10",
  };

  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#111111] border rounded-sm p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        solved
          ? "border-[#39FF14]/40 bg-[#111111]/90 shadow-[0_0_12px_rgba(57,255,20,0.08)]"
          : "border-[#242424] hover:border-[#39FF14]/60 hover:shadow-[0_0_15px_rgba(57,255,20,0.12)]"
      }`}
    >
      <div>
        {/* Top Badges: Category + Difficulty + Solved Status */}
        <div className="flex items-center justify-between mb-3.5 gap-2">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-[#242424] bg-[#080808] text-[#8A8A8A] uppercase">
              {category}
            </span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                difficultyColors[difficulty] || "text-[#8A8A8A]"
              }`}
            >
              {difficulty}
            </span>
          </div>

          {/* Solved / Unsolved Badge */}
          {solved ? (
            <span className="inline-flex items-center space-x-1 text-[10px] font-mono text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/30 px-2 py-0.5 rounded">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              <span>SOLVED</span>
            </span>
          ) : (
            <span className="text-[10px] font-mono text-[#8A8A8A] bg-[#080808] border border-[#242424] px-2 py-0.5 rounded">
              UNSOLVED
            </span>
          )}
        </div>

        {/* Challenge Title */}
        <h3 className="text-base font-minecraftBold text-[#F5F5F5] group-hover:text-[#39FF14] transition-colors mb-2 tracking-wide leading-snug">
          {title}
        </h3>
      </div>

      {/* Footer: Points & Arrow */}
      <div className="mt-4 pt-3 border-t border-[#242424]/60 flex items-center justify-between font-spaceMonoBold">
        <div className="text-sm font-minecraftBold text-[#39FF14] tracking-wide">
          {points} <span className="text-xs font-spaceMonoBold text-[#8A8A8A]">PTS</span>
        </div>

        <div className="text-xs text-[#8A8A8A] group-hover:text-[#39FF14] transition-colors flex items-center space-x-1">
          <span>VIEW</span>
          <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </div>
      </div>
    </div>
  );
}
