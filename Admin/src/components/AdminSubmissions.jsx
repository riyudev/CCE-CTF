import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

export default function AdminSubmissions({ currentPath, navigateTo, onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterResult, setFilterResult] = useState("ALL"); // 'ALL' | 'CORRECT' | 'INCORRECT'
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getSubmissions();
      if (res.submissions) {
        setSubmissions(res.submissions);
      }
    } catch (err) {
      console.error("[ADMIN SUBMISSIONS] Fetch error:", err.message);
      setErrorMsg(err.message || "Failed to load submissions from MongoDB.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const filteredSubmissions = submissions.filter((sub) => {
    const isCorrect = sub.correct === true;
    const resultStr = isCorrect ? "CORRECT" : "INCORRECT";

    const matchesFilter =
      filterResult === "ALL" || resultStr === filterResult;

    const q = searchQuery.toLowerCase();
    const teamName = typeof sub.team === "object" ? sub.team?.name || "" : "";
    const userName = typeof sub.user === "object" ? sub.user?.username || sub.user?.name || "" : "";
    const challengeTitle = typeof sub.challenge === "object" ? sub.challenge?.title || "" : "";
    const flagStr = sub.submittedFlag || "";

    const matchesSearch =
      teamName.toLowerCase().includes(q) ||
      userName.toLowerCase().includes(q) ||
      challengeTitle.toLowerCase().includes(q) ||
      flagStr.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          SUBMISSIONS LOG
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Review real-time flag submissions recorded in MongoDB.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

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
                <th className="py-3 px-4 text-right">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; LOADING SUBMISSIONS FROM MONGODB...
                  </td>
                </tr>
              ) : filteredSubmissions.length > 0 ? (
                filteredSubmissions.map((sub) => {
                  const teamName = typeof sub.team === "object" ? sub.team?.name || "N/A" : "N/A";
                  const userName = typeof sub.user === "object" ? sub.user?.username || sub.user?.name || "N/A" : "N/A";
                  const challengeTitle = typeof sub.challenge === "object" ? sub.challenge?.title || "N/A" : "N/A";
                  const isCorrect = sub.correct === true;
                  const timeDisplay = sub.submittedAt || sub.createdAt
                    ? new Date(sub.submittedAt || sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    : "N/A";

                  return (
                    <tr key={sub._id} className="hover:bg-[#080808]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#F5F5F5]">{teamName}</td>
                      <td className="py-3 px-4 text-[#8A8A8A]">@{userName}</td>
                      <td className="py-3 px-4 text-[#39FF14]">{challengeTitle}</td>
                      <td className="py-3 px-4 font-mono text-[#8A8A8A]">{sub.submittedFlag}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isCorrect
                              ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                              : "bg-[#FF4D4D]/10 text-[#FF4D4D] border border-[#FF4D4D]/30"
                          }`}
                        >
                          {isCorrect ? "CORRECT" : "INCORRECT"}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-minecraftBold text-[#39FF14]">
                        +{sub.points || 0}
                      </td>
                      <td className="py-3 px-4 text-right text-[#8A8A8A] font-mono">
                        {timeDisplay}
                      </td>
                    </tr>
                  );
                })
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
