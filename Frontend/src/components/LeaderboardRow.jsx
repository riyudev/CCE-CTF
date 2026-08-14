import React from "react";

export default function LeaderboardRow({ teamData, userTeamName, variant = "desktop" }) {
  const { rank, team, score, solved, movement } = teamData;
  const isCurrentTeam =
    userTeamName && team.toLowerCase() === userTeamName.toLowerCase();

  const isRank1 = rank === 1;
  const isRank2 = rank === 2;
  const isRank3 = rank === 3;

  const renderMovement = () => {
    if (movement === "up") {
      return <span className="text-[#39FF14] text-xs font-bold" title="Rank Up">&nbsp;▲</span>;
    }
    if (movement === "down") {
      return <span className="text-[#FF4D4D] text-xs font-bold" title="Rank Down">&nbsp;▼</span>;
    }
    return <span className="text-[#8A8A8A] text-xs" title="No Change">&nbsp;&ndash;</span>;
  };

  if (variant === "mobile") {
    return (
      <div
        className={`bg-[#111111] border p-4 rounded-sm space-y-3 transition-all ${
          isCurrentTeam
            ? "border-[#39FF14] bg-[#39FF14]/5 shadow-[0_0_15px_rgba(57,255,20,0.15)]"
            : isRank1
              ? "border-[#39FF14]/50"
              : "border-[#242424]"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span
              className={`w-7 h-7 rounded flex items-center justify-center font-minecraftBold text-xs ${
                isRank1
                  ? "bg-[#39FF14] text-[#080808]"
                  : isRank2
                    ? "bg-[#E5E7EB] text-[#080808]"
                    : isRank3
                      ? "bg-[#D97706] text-[#F5F5F5]"
                      : "bg-[#080808] text-[#8A8A8A] border border-[#242424]"
              }`}
            >
              #{rank}
            </span>
            {renderMovement()}
          </div>

          <div className="flex items-center space-x-2">
            {isRank1 && (
              <span className="text-[9px] bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14] px-1.5 py-0.5 rounded font-bold uppercase">
                CHAMPION
              </span>
            )}
            {isCurrentTeam && (
              <span className="text-[9px] bg-[#39FF14] text-[#080808] px-1.5 py-0.5 rounded font-bold uppercase">
                YOUR TEAM
              </span>
            )}
          </div>
        </div>

        <div>
          <h4
            className={`text-base font-minecraftBold ${
              isRank1 || isCurrentTeam ? "text-[#39FF14]" : "text-[#F5F5F5]"
            }`}
          >
            {team}
          </h4>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#242424]/60 text-xs font-spaceMonoBold">
          <div className="text-[#39FF14] font-minecraftBold text-sm">{score} PTS</div>
          <div className="text-[#8A8A8A]">{solved} SOLVED</div>
        </div>
      </div>
    );
  }

  return (
    <tr
      className={`transition-all duration-200 border-b border-[#242424]/60 ${
        isCurrentTeam
          ? "bg-[#39FF14]/10 border-l-4 border-l-[#39FF14] border-[#39FF14]/40 shadow-[0_0_15px_rgba(57,255,20,0.1)]"
          : isRank1
            ? "bg-[#111111] hover:bg-[#161616]"
            : "bg-[#080808] hover:bg-[#111111]"
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-minecraftBold">
        <div className="flex items-center space-x-2">
          <span
            className={`w-7 h-7 rounded flex items-center justify-center font-minecraftBold ${
              isRank1
                ? "bg-[#39FF14] text-[#080808] shadow-[0_0_10px_#39FF14]"
                : isRank2
                  ? "bg-[#E5E7EB] text-[#080808]"
                  : isRank3
                    ? "bg-[#D97706] text-[#F5F5F5]"
                    : "bg-[#111111] text-[#8A8A8A] border border-[#242424]"
            }`}
          >
            #{rank}
          </span>
          {renderMovement()}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <span
            className={`text-base font-minecraftBold tracking-wide ${
              isRank1
                ? "text-[#39FF14] text-glow-neon"
                : isCurrentTeam
                  ? "text-[#39FF14]"
                  : "text-[#F5F5F5]"
            }`}
          >
            {team}
          </span>

          {isRank1 && (
            <span className="text-[10px] font-spaceMonoBold bg-[#39FF14]/20 text-[#39FF14] border border-[#39FF14] px-2 py-0.5 rounded tracking-widest uppercase font-bold shadow-[0_0_8px_rgba(57,255,20,0.3)]">
              CHAMPION
            </span>
          )}

          {isCurrentTeam && (
            <span className="text-[10px] font-spaceMonoBold bg-[#39FF14] text-[#080808] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
              YOUR TEAM
            </span>
          )}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-minecraftBold text-[#39FF14]">
        {score} <span className="text-xs font-spaceMonoBold text-[#8A8A8A]">PTS</span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-spaceMonoBold text-[#F5F5F5]">
        <span className="bg-[#111111] border border-[#242424] px-2.5 py-1 rounded text-xs text-[#F5F5F5]">
          {solved} SOLVED
        </span>
      </td>
    </tr>
  );
}
