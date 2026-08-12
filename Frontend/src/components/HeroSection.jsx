import React from "react";

export default function HeroSection({ onJoinClick, onViewLeaderboardClick }) {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#242424]">
      {/* Background Cybersecurity Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Decorative scanline overlay */}
      <div className="absolute inset-0 scanline opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Status Label */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111111] border border-[#39FF14]/30 rounded-full mb-6 text-xs text-[#39FF14] font-spaceMonoBold tracking-widest uppercase shadow-[0_0_10px_rgba(57,255,20,0.1)]">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse shadow-[0_0_6px_#39FF14]" />
          <span>&gt; SYSTEM ONLINE</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-6 leading-tight text-glow-neon">
          CCE CTF <span className="text-[#39FF14]">COMPETITION</span>
        </h1>

        {/* Description */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#F5F5F5] font-spaceMonoBold tracking-wide mb-10 leading-relaxed text-slate-200">
          Test your skills. Solve challenges. Capture the flag.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <button
            onClick={onJoinClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#39FF14] text-[#080808] font-spaceMonoBold font-bold text-sm tracking-wider uppercase rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_20px_rgba(57,255,20,0.5)] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            JOIN COMPETITION
          </button>

          <button
            onClick={onViewLeaderboardClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111111]/80 text-[#F5F5F5] border border-[#39FF14]/50 font-spaceMonoBold text-sm tracking-wider uppercase rounded-sm hover:border-[#39FF14] hover:text-[#39FF14] hover:bg-[#111111] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] transition-all duration-200 active:scale-95 cursor-pointer"
          >
            VIEW LEADERBOARD
          </button>
        </div>

        {/* Terminal Meta Details */}
        <div className="mt-14 pt-8 border-t border-[#242424]/60 flex justify-center items-center gap-8 text-xs text-[#8A8A8A] font-spaceMonoBold">
          <div className="flex items-center space-x-2">
            <span className="text-[#16A34A]">&gt;</span>
            <span>MODE: <strong className="text-[#F5F5F5]">JEOPARDY CTF</strong></span>
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="text-[#16A34A]">&gt;</span>
            <span>STATUS: <strong className="text-[#39FF14]">ACTIVE</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-[#16A34A]">&gt;</span>
            <span>HOST: <strong className="text-[#F5F5F5]">CCE DEPT</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}
