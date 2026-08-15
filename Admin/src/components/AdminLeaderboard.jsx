import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

export default function AdminLeaderboard({ currentPath, navigateTo, onLogout }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getLeaderboard();
      if (res.leaderboard) {
        setLeaderboard(res.leaderboard);
      }
    } catch (err) {
      console.error("[ADMIN LEADERBOARD] Error fetching leaderboard:", err.message);
      setErrorMsg(err.message || "Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
            LEADERBOARD MONITORING
          </h1>
          <p className="text-xs text-[#8A8A8A]">
            Real-time competition rankings calculated from live submission scores.
          </p>
        </div>
        <button
          onClick={fetchLeaderboard}
          className="px-3 py-1.5 bg-[#111111] text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#080808] text-xs font-bold uppercase rounded-sm transition-all cursor-pointer"
        >
          REFRESH
        </button>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

      <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080808] border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3.5 px-4 w-16 text-center">RANK</th>
                <th className="py-3.5 px-4">TEAM NAME</th>
                <th className="py-3.5 px-4 text-center">SOLVED</th>
                <th className="py-3.5 px-4 text-right">TOTAL SCORE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; FETCHING LEADERBOARD DATA...
                  </td>
                </tr>
              ) : leaderboard.length > 0 ? (
                leaderboard.map((item, idx) => {
                  const rank = item.rank || idx + 1;
                  const isTop3 = rank <= 3;

                  return (
                    <tr key={item.teamId || item.team || idx} className="hover:bg-[#080808]/50 transition-colors">
                      <td className="py-3.5 px-4 text-center font-minecraftBold">
                        <span
                          className={`inline-block w-6 h-6 leading-6 text-center rounded-full text-xs ${
                            rank === 1
                              ? "bg-[#39FF14] text-[#080808] font-bold shadow-[0_0_8px_#39FF14]"
                              : rank === 2
                                ? "bg-[#38BDF8] text-[#080808] font-bold"
                                : rank === 3
                                  ? "bg-[#EAB308] text-[#080808] font-bold"
                                  : "text-[#8A8A8A]"
                          }`}
                        >
                          #{rank}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#F5F5F5]">
                        <span className={isTop3 ? "text-[#39FF14]" : ""}>
                          {item.team || item.name}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center text-[#8A8A8A] font-mono">
                        {item.solved || 0}
                      </td>
                      <td className="py-3.5 px-4 text-right font-minecraftBold text-[#39FF14] text-sm">
                        {item.score || 0} PTS
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-[#8A8A8A]">
                    No leaderboard scores logged yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
