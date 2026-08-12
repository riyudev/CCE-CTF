import React, { useState } from "react";
import AdminLayout from "./AdminLayout";

export default function AdminTeams({ currentPath, navigateTo }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeamModal, setSelectedTeamModal] = useState(null);

  const mockTeams = [
    { name: "Cyber Warriors", code: "CCE-X7K9", leader: "Reyu", members: "3 / 5", score: 1250, status: "ACTIVE" },
    { name: "Byte Hunters", code: "CCE-H9P2", leader: "Sarah", members: "4 / 5", score: 1100, status: "ACTIVE" },
    { name: "Root Access", code: "CCE-R4K1", leader: "David", members: "5 / 5", score: 950, status: "ACTIVE" },
    { name: "Hack Masters", code: "CCE-M7L3", leader: "Emily", members: "2 / 5", score: 800, status: "ACTIVE" },
    { name: "Null Pointers", code: "CCE-N0P5", leader: "James", members: "3 / 5", score: 700, status: "ACTIVE" },
  ];

  const filteredTeams = mockTeams.filter((t) => {
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.code.toLowerCase().includes(q);
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          TEAMS MANAGEMENT
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Monitor active competing teams and codes.
        </p>
      </div>

      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search teams by name or code..."
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
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {filteredTeams.map((t) => (
                <tr key={t.code} className="hover:bg-[#080808]/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#39FF14]">{t.name}</td>
                  <td className="py-3 px-4 font-mono text-[#F5F5F5]">{t.code}</td>
                  <td className="py-3 px-4 text-[#F5F5F5]">{t.leader}</td>
                  <td className="py-3 px-4 text-[#8A8A8A]">{t.members}</td>
                  <td className="py-3 px-4 font-minecraftBold text-[#39FF14]">{t.score} PTS</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedTeamModal(t)}
                      className="px-3 py-1 bg-[#080808] text-[#39FF14] border border-[#39FF14]/40 hover:bg-[#39FF14] hover:text-[#080808] text-[10px] uppercase font-bold rounded-sm transition-all cursor-pointer"
                    >
                      VIEW TEAM
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW TEAM MODAL */}
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
              <div>Leader: <strong className="text-[#F5F5F5]">{selectedTeamModal.leader}</strong></div>
              <div>Members Count: <strong className="text-[#F5F5F5]">{selectedTeamModal.members}</strong></div>
              <div>Current Score: <strong className="text-[#39FF14] font-minecraftBold">{selectedTeamModal.score} PTS</strong></div>
              <div>Status: <span className="text-[#39FF14] font-bold">{selectedTeamModal.status}</span></div>
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
    </AdminLayout>
  );
}
