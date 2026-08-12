import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { initialAdminSubmissions } from "../../data/adminData";

export default function AdminSubmissions({ currentPath, navigateTo, onLogout }) {
  const [filterResult, setFilterResult] = useState("ALL"); // 'ALL' | 'CORRECT' | 'INCORRECT'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSubmissions = initialAdminSubmissions.filter((sub) => {
    const matchesFilter =
      filterResult === "ALL" || sub.result === filterResult;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      sub.team.toLowerCase().includes(q) ||
      sub.user.toLowerCase().includes(q) ||
      sub.challenge.toLowerCase().includes(q) ||
      sub.flag.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          SUBMISSIONS LOG
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Review all flag submissions across participating teams.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search submissions by team, user, challenge, or flag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] text-xs rounded-sm px-4 py-2.5 outline-none placeholder:text-[#555555]"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-2">
          {["ALL", "CORRECT", "INCORRECT"].map((res) => (
            <button
              key={res}
              onClick={() => setFilterResult(res)}
              className={`px-3 py-2 text-xs uppercase tracking-wider rounded-sm transition-all cursor-pointer ${
                filterResult === res
                  ? "bg-[#39FF14] text-[#080808] font-bold"
                  : "bg-[#111111] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5]"
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080808] border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3 px-4">TEAM</th>
                <th className="py-3 px-4">USER</th>
                <th className="py-3 px-4">CHALLENGE</th>
                <th className="py-3 px-4">SUBMITTED FLAG</th>
                <th className="py-3 px-4">RESULT</th>
                <th className="py-3 px-4">POINTS</th>
                <th className="py-3 px-4 text-right">TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#080808]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F5F5F5]">{sub.team}</td>
                    <td className="py-3 px-4 text-[#8A8A8A]">{sub.user}</td>
                    <td className="py-3 px-4 text-[#39FF14]">{sub.challenge}</td>
                    <td className="py-3 px-4 font-mono text-[#8A8A8A]">{sub.flag}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.result === "CORRECT"
                            ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                            : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                        }`}
                      >
                        {sub.result}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-minecraftBold text-[#39FF14]">
                      +{sub.points}
                    </td>
                    <td className="py-3 px-4 text-right text-[#8A8A8A] font-mono">
                      {sub.time}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8A8A8A]">
                    No submissions found matching criteria.
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
