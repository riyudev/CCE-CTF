import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../services/api";

export default function AdminCompetition({
  currentPath,
  navigateTo,
  onLogout,
  competitionSettings,
  setCompetitionSettings,
}) {
  const [localSettings, setLocalSettings] = useState({
    name: "CCE CTF Competition",
    status: "LIVE",
    startTime: "2026-08-12T08:00:00",
    endTime: "2026-08-14T18:00:00",
    registrationOpen: true,
    maxTeamSize: 5,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);

  const formatForDateTimeInput = (isoStr) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      if (isNaN(d.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    } catch {
      return "";
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getCompetition();
      if (res.competition) {
        setLocalSettings({
          ...res.competition,
          startTime: res.competition.startTime ? formatForDateTimeInput(res.competition.startTime) : "",
          endTime: res.competition.endTime ? formatForDateTimeInput(res.competition.endTime) : "",
        });
        if (setCompetitionSettings) setCompetitionSettings(res.competition);
      }
    } catch (err) {
      console.error("[ADMIN COMPETITION] Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (updates) => {
    setSaving(true);
    setNotice(null);
    try {
      const updatedObj = { ...localSettings, ...updates };
      
      // Convert datetime inputs back to ISO strings
      const payload = {
        ...updatedObj,
        startTime: updatedObj.startTime ? new Date(updatedObj.startTime).toISOString() : localSettings.startTime,
        endTime: updatedObj.endTime ? new Date(updatedObj.endTime).toISOString() : localSettings.endTime,
      };

      const res = await api.admin.updateCompetition(payload);
      if (res.competition) {
        setLocalSettings({
          ...res.competition,
          startTime: res.competition.startTime ? formatForDateTimeInput(res.competition.startTime) : "",
          endTime: res.competition.endTime ? formatForDateTimeInput(res.competition.endTime) : "",
        });
        if (setCompetitionSettings) setCompetitionSettings(res.competition);
        setNotice("Competition settings successfully saved to MongoDB!");
      }
    } catch (err) {
      setNotice(`Error: ${err.message || "Failed to update settings"}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          COMPETITION SETTINGS
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Configure start/end times, competition status, and registration availability stored in MongoDB.
        </p>
      </div>

      {notice && (
        <div className={`p-3 rounded-sm text-xs font-spaceMonoBold border ${
          notice.startsWith("Error") ? "bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]" : "bg-[#39FF14]/10 text-[#39FF14] border-[#39FF14]"
        }`}>
          &gt; {notice}
        </div>
      )}

      {/* Main Settings Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date & Time Parameters Card */}
        <div className="bg-[#111111] border border-[#242424] p-6 rounded-sm space-y-4 box-glow-neon">
          <h3 className="text-base font-minecraftBold text-[#39FF14] uppercase tracking-wide border-b border-[#242424] pb-3">
            TIMER & DATE PARAMETERS
          </h3>

          <div className="space-y-4 text-xs font-spaceMonoBold">
            <div>
              <label className="text-[#8A8A8A] uppercase block mb-1">Competition Start Date & Time (Server Time)</label>
              <input
                type="datetime-local"
                value={localSettings.startTime}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, startTime: e.target.value }))}
                className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] rounded-sm px-3 py-2 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[#8A8A8A] uppercase block mb-1">Competition End Date & Time (Server Time)</label>
              <input
                type="datetime-local"
                value={localSettings.endTime}
                onChange={(e) => setLocalSettings((prev) => ({ ...prev, endTime: e.target.value }))}
                className="w-full bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] rounded-sm px-3 py-2 outline-none font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleSaveSettings({})}
                disabled={saving}
                className="w-full py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#39FF14]/90 cursor-pointer disabled:opacity-50"
              >
                {saving ? "SAVING..." : "SAVE START/END TIMES TO DB"}
              </button>
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
              <span className="text-xs text-[#8A8A8A] block mb-2 uppercase">Current Status: <strong className="text-[#39FF14]">{localSettings.status}</strong></span>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleSaveSettings({ status: "UPCOMING" })}
                  className={`py-2 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    localSettings.status === "UPCOMING"
                      ? "bg-[#38BDF8] text-[#080808]"
                      : "bg-[#080808] text-[#38BDF8] border border-[#38BDF8]/50 hover:bg-[#38BDF8] hover:text-[#080808]"
                  }`}
                >
                  UPCOMING
                </button>
                <button
                  onClick={() => handleSaveSettings({ status: "LIVE" })}
                  className={`py-2 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    localSettings.status === "LIVE"
                      ? "bg-[#39FF14] text-[#080808]"
                      : "bg-[#080808] text-[#39FF14] border border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-[#080808]"
                  }`}
                >
                  START (LIVE)
                </button>
                <button
                  onClick={() => handleSaveSettings({ status: "PAUSED" })}
                  className={`py-2 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    localSettings.status === "PAUSED"
                      ? "bg-[#EAB308] text-[#080808]"
                      : "bg-[#080808] text-[#EAB308] border border-[#EAB308]/50 hover:bg-[#EAB308] hover:text-[#080808]"
                  }`}
                >
                  PAUSE
                </button>
                <button
                  onClick={() => handleSaveSettings({ status: "ENDED" })}
                  className={`py-2 text-[10px] font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    localSettings.status === "ENDED"
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
                  onClick={() => handleSaveSettings({ registrationOpen: true })}
                  className={`py-2.5 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    localSettings.registrationOpen
                      ? "bg-[#39FF14] text-[#080808]"
                      : "bg-[#080808] text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#080808]"
                  }`}
                >
                  OPEN REGISTRATION
                </button>
                <button
                  onClick={() => handleSaveSettings({ registrationOpen: false })}
                  className={`py-2.5 text-xs font-bold uppercase rounded-sm cursor-pointer transition-all ${
                    !localSettings.registrationOpen
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
