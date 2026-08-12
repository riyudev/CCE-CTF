import React from "react";
import AdminLayout from "./AdminLayout";

export default function AdminCompetition({
  currentPath,
  navigateTo,
  competitionSettings,
  setCompetitionSettings,
}) {
  const updateSetting = (key, value) => {
    setCompetitionSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          COMPETITION SETTINGS
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Configure overall event parameters, timer status, and registration availability.
        </p>
      </div>

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Details Card */}
        <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-4 box-glow-neon">
          <h3 className="text-base font-minecraftBold text-[#39FF14] uppercase tracking-wide border-b border-[#242424] pb-3">
            EVENT PARAMETERS
          </h3>

          <div className="space-y-3 text-xs font-spaceMonoBold">
            <div className="flex items-center justify-between py-1.5 border-b border-[#242424]/60">
              <span className="text-[#8A8A8A]">Competition Name</span>
              <span className="text-[#F5F5F5] font-bold">{competitionSettings.name}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#242424]/60">
              <span className="text-[#8A8A8A]">Event Status</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  competitionSettings.status === "LIVE"
                    ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                    : competitionSettings.status === "PAUSED"
                    ? "bg-[#EAB308]/10 text-[#EAB308] border border-[#EAB308]/30"
                    : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                }`}
              >
                ● {competitionSettings.status}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#242424]/60">
              <span className="text-[#8A8A8A]">Start Time</span>
              <span className="text-[#F5F5F5] font-mono">{competitionSettings.startTime}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#242424]/60">
              <span className="text-[#8A8A8A]">End Time</span>
              <span className="text-[#F5F5F5] font-mono">{competitionSettings.endTime}</span>
            </div>

            <div className="flex items-center justify-between py-1.5 border-b border-[#242424]/60">
              <span className="text-[#8A8A8A]">Registration</span>
              <span
                className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                  competitionSettings.registration === "OPEN"
                    ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                    : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                }`}
              >
                {competitionSettings.registration}
              </span>
            </div>

            <div className="flex items-center justify-between py-1.5">
              <span className="text-[#8A8A8A]">Maximum Team Size</span>
              <span className="text-[#39FF14] font-bold">{competitionSettings.maxTeamSize} Participants</span>
            </div>
          </div>
        </div>

        {/* Action Controls Card */}
        <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-6">
          <h3 className="text-base font-minecraftBold text-[#F5F5F5] uppercase tracking-wide border-b border-[#242424] pb-3">
            STATE CONTROLS
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-xs text-[#8A8A8A] block mb-2 uppercase">Competition Control</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => updateSetting("status", "LIVE")}
                  className={`py-2 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    competitionSettings.status === "LIVE"
                      ? "bg-[#39FF14] text-[#080808]"
                      : "bg-[#080808] text-[#39FF14] border border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-[#080808]"
                  }`}
                >
                  START
                </button>
                <button
                  onClick={() => updateSetting("status", "PAUSED")}
                  className={`py-2 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    competitionSettings.status === "PAUSED"
                      ? "bg-[#EAB308] text-[#080808]"
                      : "bg-[#080808] text-[#EAB308] border border-[#EAB308]/50 hover:bg-[#EAB308] hover:text-[#080808]"
                  }`}
                >
                  PAUSE
                </button>
                <button
                  onClick={() => updateSetting("status", "ENDED")}
                  className={`py-2 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    competitionSettings.status === "ENDED"
                      ? "bg-[#FF4D4D] text-[#080808]"
                      : "bg-[#080808] text-[#FF4D4D] border border-[#FF4D4D]/50 hover:bg-[#FF4D4D] hover:text-[#080808]"
                  }`}
                >
                  END
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-[#242424]">
              <span className="text-xs text-[#8A8A8A] block mb-2 uppercase">Registration Controls</span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateSetting("registration", "OPEN")}
                  className={`py-2.5 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    competitionSettings.registration === "OPEN"
                      ? "bg-[#39FF14] text-[#080808]"
                      : "bg-[#080808] text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#080808]"
                  }`}
                >
                  OPEN REGISTRATION
                </button>
                <button
                  onClick={() => updateSetting("registration", "CLOSED")}
                  className={`py-2.5 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    competitionSettings.registration === "CLOSED"
                      ? "bg-[#FF4D4D] text-[#080808]"
                      : "bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#FF4D4D] hover:border-[#FF4D4D]"
                  }`}
                >
                  CLOSE REGISTRATION
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
