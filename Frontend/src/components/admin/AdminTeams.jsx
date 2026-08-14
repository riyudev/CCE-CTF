import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../../services/api";

export default function AdminTeams({ currentPath, navigateTo, onLogout }) {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getTeams();
      if (res.teams) {
        setTeams(res.teams);
      }
    } catch (err) {
      console.error("[ADMIN TEAMS] Error fetching teams:", err.message);
      setErrorMsg(err.message || "Failed to load teams from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDeleteTeam = async () => {
    if (!deleteTarget) return;
    try {
      await api.admin.deleteTeam(deleteTarget._id);
      setDeleteTarget(null);
      fetchTeams();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete team.");
      setDeleteTarget(null);
    }
  };

  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    const leaderName = typeof t.leader === "object" ? t.leader?.username || t.leader?.name || "" : "";
    return (
      (t.name || "").toLowerCase().includes(q) ||
      (t.code || "").toLowerCase().includes(q) ||
      leaderName.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          TEAMS MANAGEMENT
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Monitor active competing teams, members, and scores stored in MongoDB.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search teams by name, code, or leader..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] text-xs rounded-sm px-4 py-2.5 outline-none placeholder:text-[#555555]"
        />
      </div>

      <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080808] border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3 px-4">TEAM NAME</th>
                <th className="py-3 px-4">TEAM CODE</th>
                <th className="py-3 px-4">LEADER</th>
                <th className="py-3 px-4">MEMBERS</th>
                <th className="py-3 px-4">SCORE</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; FETCHING TEAMS FROM MONGODB...
                  </td>
                </tr>
              ) : filteredTeams.length > 0 ? (
                filteredTeams.map((t) => {
                  const leaderName = typeof t.leader === "object" ? t.leader?.username || t.leader?.name || "N/A" : "N/A";
                  const memberCount = Array.isArray(t.members) ? t.members.length : 1;

                  return (
                    <tr key={t._id || t.code} className="hover:bg-[#080808]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#39FF14]">{t.name}</td>
                      <td className="py-3 px-4 font-mono text-[#F5F5F5]">{t.code}</td>
                      <td className="py-3 px-4 text-[#F5F5F5]">@{leaderName}</td>
                      <td className="py-3 px-4 text-[#8A8A8A]">{memberCount} / 5</td>
                      <td className="py-3 px-4 font-minecraftBold text-[#39FF14]">{t.score || 0} PTS</td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedTeamModal(t)}
                          className="px-2.5 py-1 bg-[#080808] text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#080808] text-[10px] uppercase font-bold rounded-sm transition-all cursor-pointer"
                        >
                          VIEW
                        </button>
                        <button
                          onClick={() => setDeleteTarget(t)}
                          className="px-2.5 py-1 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:border-[#FF4D4D] hover:text-[#FF4D4D] text-[10px] uppercase font-bold rounded-sm cursor-pointer"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8A8A8A]">
                    No teams found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TEAM DETAILS MODAL */}
      {selectedTeamModal && (
        <div className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#39FF14] rounded-sm p-6 max-w-md w-full space-y-4 box-glow-neon">
            <div className="flex items-center justify-between border-b border-[#242424] pb-3">
              <h3 className="text-lg font-minecraftBold text-[#39FF14]">
                {selectedTeamModal.name}
              </h3>
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="text-[#8A8A8A] hover:text-[#FF4D4D] text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#8A8A8A]">
              <div>Team Code: <strong className="text-[#39FF14] font-mono">{selectedTeamModal.code}</strong></div>
              <div>
                Leader:{" "}
                <strong className="text-[#F5F5F5]">
                  {typeof selectedTeamModal.leader === "object"
                    ? selectedTeamModal.leader?.name || selectedTeamModal.leader?.username
                    : "N/A"}
                </strong>
              </div>
              <div>Current Score: <strong className="text-[#39FF14] font-minecraftBold">{selectedTeamModal.score || 0} PTS</strong></div>
              <div className="pt-2 border-t border-[#242424]">
                <div className="font-bold text-[#F5F5F5] mb-2 uppercase">Team Members ({selectedTeamModal.members?.length || 0}/5):</div>
                <ul className="space-y-1 bg-[#080808] p-3 border border-[#242424] rounded-sm max-h-40 overflow-y-auto">
                  {Array.isArray(selectedTeamModal.members) && selectedTeamModal.members.length > 0 ? (
                    selectedTeamModal.members.map((m, idx) => (
                      <li key={m._id || idx} className="flex justify-between items-center text-[#F5F5F5]">
                        <span>• {m.name || m.username}</span>
                        <span className="text-[#8A8A8A] text-[10px]">@{m.username}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-[#8A8A8A] italic">No member data listed</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedTeamModal(null)}
                className="w-full py-2 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#39FF14]/90"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE TEAM CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#FF4D4D] rounded-sm p-6 max-w-sm w-full space-y-4 box-glow-neon">
            <h3 className="text-base font-minecraftBold text-[#FF4D4D] uppercase">
              CONFIRM DELETE TEAM
            </h3>
            <p className="text-xs text-[#F5F5F5] leading-relaxed font-spaceMonoBold">
              Are you sure you want to delete team <strong>{deleteTarget.name}</strong> ({deleteTarget.code})? Team members will be detached.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleDeleteTeam}
                className="flex-1 py-2 bg-[#FF4D4D] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#FF4D4D]/90 cursor-pointer"
              >
                DELETE TEAM
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] font-bold text-xs uppercase rounded-sm cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
