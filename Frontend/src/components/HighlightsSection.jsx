import React from "react";

export default function HighlightsSection({ onCardClick }) {
  const highlights = [
    {
      id: "challenges",
      title: "CHALLENGES",
      description: "Solve cybersecurity challenges and capture the hidden flags.",
      tag: "[01]",
      icon: (
        <svg
          className="w-6 h-6 text-[#39FF14]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
          />
        </svg>
      ),
    },
    {
      id: "teams",
      title: "TEAMS",
      description: "Work together and compete against other teams.",
      tag: "[02]",
      icon: (
        <svg
          className="w-6 h-6 text-[#39FF14]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      id: "leaderboard",
      title: "LEADERBOARD",
      description: "Earn points, climb the rankings, and become the top team.",
      tag: "[03]",
      icon: (
        <svg
          className="w-6 h-6 text-[#39FF14]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 font-spaceMonoBold">
      <div className="flex items-center space-x-3 mb-10">
        <span className="text-[#39FF14] font-minecraftBold text-lg">&gt;</span>
        <h2 className="text-xl sm:text-2xl font-minecraftBold text-[#F5F5F5] tracking-wide uppercase">
          COMPETITION HIGHLIGHTS
        </h2>
        <div className="h-[1px] flex-1 bg-[#242424]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {highlights.map((item) => (
          <div
            key={item.id}
            onClick={() => onCardClick && onCardClick(item.id)}
            className="group relative bg-[#111111] border border-[#242424] p-6 rounded-sm hover:border-[#39FF14]/60 hover:shadow-[0_0_15px_rgba(57,255,20,0.12)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Top Row: Icon + Tag */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded border border-[#242424] bg-[#080808] flex items-center justify-center group-hover:border-[#39FF14]/40 transition-colors">
                  {item.icon}
                </div>
                <span className="text-xs text-[#16A34A] group-hover:text-[#39FF14] transition-colors font-mono">
                  {item.tag}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-minecraftBold text-[#F5F5F5] mb-2 group-hover:text-[#39FF14] transition-colors tracking-wide">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[#8A8A8A] leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Bottom accent line */}
            <div className="mt-6 pt-4 border-t border-[#242424]/60 flex items-center text-xs text-[#8A8A8A] group-hover:text-[#39FF14] transition-colors">
              <span>EXPLORE</span>
              <span className="ml-1 transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
