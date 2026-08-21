import React, { useState, useEffect } from "react";
import InputField from "./InputField";
import { api, getStoredUser, setStoredUser } from "../services/api";

export default function TeamSetupPage({
  userTeam,
  setUserTeam,
  navigateTo,
  showToast,
}) {
  const [activeTab, setActiveTab] = useState(null);

  // Form states
  const [createName, setCreateName] = useState("");
  const [createError, setCreateError] = useState(null);
  const [createdTeamData, setCreatedTeamData] = useState(null);

  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState(null);
  const [joinedTeamData, setJoinedTeamData] = useState(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch current user team on mount if token exists
  useEffect(() => {
    async function fetchTeam() {
      try {
        const res = await api.teams.getMyTeam();
        if (res.team) {
          setUserTeam(res.team);
        }
      } catch (err) {
        console.log("[TEAM SETUP] Fetch Team Notice:", err.message);
      }
    }
    fetchTeam();
  }, [setUserTeam]);

  const handleCopyCode = (codeToCopy) => {
    navigator.clipboard.writeText(codeToCopy);
    setCopiedCode(true);
    if (showToast) showToast("Team code copied to clipboard!");
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Handle Team Creation
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const trimmed = createName.trim();
    if (!trimmed) {
      setCreateError("Team name is required");
      return;
    }
    if (trimmed.length < 3) {
      setCreateError("Team name must be at least 3 characters");
      return;
    }

    setCreateError(null);
    setIsSubmitting(true);

    try {
      const res = await api.teams.create(trimmed);
      if (res.team) {
        setCreatedTeamData(res.team);
        setUserTeam(res.team);
        const stored = getStoredUser();
        if (stored && stored.role !== "admin") {
          setStoredUser({ ...stored, role: res.role || "leader" });
        }
        if (showToast) showToast("Team created successfully!");
      }
    } catch (err) {
      setCreateError(err.message || "Failed to create team.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Team Joining
  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    const trimmed = joinCode.trim();
    if (!trimmed) {
      setJoinError("Team code is required");
      return;
    }

    setJoinError(null);
    setIsSubmitting(true);

    try {
      const res = await api.teams.join(trimmed);
      if (res.team) {
        setJoinedTeamData(res.team);
        setUserTeam(res.team);
        const stored = getStoredUser();
        if (stored && stored.role !== "admin" && res.role) {
          setStoredUser({ ...stored, role: res.role });
        }
        if (showToast) showToast("Joined team successfully!");
      }
    } catch (err) {
      setJoinError(err.message || "Invalid team code or team is full.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoToDashboard = () => {
    navigateTo("/dashboard");
  };

  const handleLeaveTeam = async () => {
    try {
      await api.teams.leave();
      setUserTeam(null);
      setCreatedTeamData(null);
      setJoinedTeamData(null);
      setActiveTab(null);
      setCreateName("");
      setJoinCode("");
      if (showToast) showToast("You have left the team.");
    } catch (err) {
      if (showToast) showToast(err.message || "Cannot leave team.");
    }
  };

  // VIEW 1: User already in a team (YOUR TEAM)
  if (userTeam) {
    const memberCount = userTeam.members ? userTeam.members.length : 1;
    const currentUser = getStoredUser();
    const leaderId =
      typeof userTeam.leader === "object" ? userTeam.leader?._id : userTeam.leader;
    const isLeader =
      leaderId &&
      (String(leaderId) === String(currentUser?.id) ||
        String(leaderId) === String(currentUser?._id));
    const roleLabel = isLeader ? "Team Leader" : "Participant";

    return (
      <section className="relative min-h-[calc(100vh-4rem-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-[#080808]">
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

        <div className="relative max-w-3xl mx-auto z-10 font-spaceMonoBold">
          <div className="text-center mb-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111111] border border-[#39FF14]/30 rounded-full mb-4 text-xs text-[#39FF14] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
              <span>TEAM STATUS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-minecraftBold text-[#F5F5F5] tracking-wide">
              YOUR TEAM
            </h1>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-sm p-6 sm:p-8 box-glow-neon space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-6 gap-4">
              <div>
                <span className="text-xs uppercase text-[#8A8A8A] tracking-wider block mb-1">
                  Team Name
                </span>
                <h2 className="text-2xl font-minecraftBold text-[#39FF14]">
                  {userTeam.name}
                </h2>
              </div>
              <div className="inline-flex items-center space-x-2 self-start sm:self-auto bg-[#080808] px-3 py-1.5 border border-[#39FF14]/40 rounded-sm">
                <span className="text-xs text-[#8A8A8A]">Role:</span>
                <span className="text-xs font-bold text-[#F5F5F5] uppercase">
                  {roleLabel}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#080808] border border-[#242424] p-4 rounded-sm">
                <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                  Team Code
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-minecraftBold text-[#F5F5F5] tracking-widest">
                    {userTeam.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyCode(userTeam.code)}
                    className="text-xs text-[#39FF14] hover:bg-[#39FF14]/10 px-2.5 py-1 rounded border border-[#39FF14]/40 transition-colors uppercase cursor-pointer"
                  >
                    {copiedCode ? "COPIED!" : "COPY CODE"}
                  </button>
                </div>
              </div>

              <div className="bg-[#080808] border border-[#242424] p-4 rounded-sm">
                <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                  Team Members
                </span>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-minecraftBold text-[#F5F5F5]">
                    {memberCount} / 5
                  </span>
                  <span className="text-xs text-[#16A34A] bg-[#16A34A]/10 px-2 py-0.5 rounded border border-[#16A34A]/30">
                    READY
                  </span>
                </div>
              </div>

              <div className="bg-[#080808] border border-[#242424] p-4 rounded-sm">
                <span className="text-xs text-[#8A8A8A] uppercase tracking-wider block mb-2">
                  Total Team Score
                </span>
                <div className="text-lg font-minecraftBold text-[#39FF14]">
                  {userTeam.score || 0} PTS
                </div>
              </div>
            </div>

            {/* TEAM ROSTER & MEMBER SCORES */}
            <div className="bg-[#080808] border border-[#242424] p-5 rounded-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#242424] pb-3">
                <h3 className="text-xs font-minecraftBold text-[#F5F5F5] uppercase tracking-wider">
                  TEAM ROSTER & MEMBER SCORES
                </h3>
                <span className="text-[10px] text-[#8A8A8A] font-mono">
                  {userTeam.members?.length || 0} MEMBERS
                </span>
              </div>

              <div className="space-y-2">
                {Array.isArray(userTeam.members) && userTeam.members.length > 0 ? (
                  userTeam.members.map((m, idx) => {
                    const isMemLeader =
                      m._id &&
                      (String(m._id) === String(leaderId) || String(m.id) === String(leaderId));

                    return (
                      <div
                        key={m._id || m.id || idx}
                        className="flex items-center justify-between bg-[#111111] border border-[#242424] px-4 py-2.5 rounded-sm text-xs hover:border-[#39FF14]/30 transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-[#39FF14] font-bold">•</span>
                          <span className="text-[#F5F5F5] font-minecraftBold">
                            {m.name || m.username}
                          </span>
                          <span className="text-[#8A8A8A] text-[10px] font-mono">
                            (@{m.username})
                          </span>
                          {isMemLeader && (
                            <span className="text-[9px] bg-[#39FF14]/10 border border-[#39FF14]/40 text-[#39FF14] px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                              LEADER
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          {m.solvesCount !== undefined && (
                            <span className="text-[10px] text-[#8A8A8A] font-mono">
                              {m.solvesCount} {m.solvesCount === 1 ? "solve" : "solves"}
                            </span>
                          )}
                          <span className="text-xs font-minecraftBold text-[#39FF14]">
                            {m.score || 0} PTS
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-[#8A8A8A] italic">No members listed.</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={handleGoToDashboard}
                className="w-full sm:flex-1 py-3.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-pointer"
              >
                GO TO DASHBOARD
              </button>
              <button
                type="button"
                onClick={handleLeaveTeam}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#080808] text-[#8A8A8A] hover:text-[#FF4D4D] border border-[#242424] hover:border-[#FF4D4D]/50 font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer"
              >
                LEAVE TEAM
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // VIEW 2: Team Setup (Create or Join Forms)
  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] py-12 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-5xl mx-auto z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#111111] border border-[#39FF14]/30 rounded-full mb-4 text-xs text-[#39FF14] tracking-widest uppercase shadow-[0_0_10px_rgba(57,255,20,0.1)]">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span>REGISTRATION TERMINAL</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-4">
            TEAM SETUP
          </h1>
          <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#8A8A8A] leading-relaxed">
            Create a new team or join an existing team to participate in the competition.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* CARD 1: CREATE A TEAM */}
          <div
            className={`bg-[#111111] border rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              activeTab === "create"
                ? "border-[#39FF14] box-glow-neon"
                : "border-[#242424] hover:border-[#39FF14]/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded border border-[#39FF14]/30 bg-[#080808] flex items-center justify-center text-[#39FF14]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs text-[#16A34A] font-mono">[LEADER]</span>
              </div>

              <h2 className="text-xl font-minecraftBold text-[#F5F5F5] mb-2 tracking-wide">
                CREATE A TEAM
              </h2>
              <p className="text-xs text-[#8A8A8A] mb-6 leading-relaxed">
                Start your own team and become its team leader.
              </p>

              {createdTeamData ? (
                <div className="bg-[#080808] border border-[#39FF14]/40 p-5 rounded-sm space-y-4 my-4 animate-fade-in">
                  <div className="flex items-center space-x-2 text-[#39FF14]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-minecraftBold text-sm">TEAM CREATED</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A]">
                    You are now the leader of <strong className="text-[#F5F5F5]">{createdTeamData.name}</strong>.
                  </p>

                  <div className="bg-[#111111] border border-[#242424] p-3 rounded-sm">
                    <span className="text-[10px] text-[#8A8A8A] uppercase tracking-wider block mb-1">
                      TEAM CODE
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-base font-minecraftBold text-[#39FF14] tracking-widest">
                        {createdTeamData.code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(createdTeamData.code)}
                        className="text-[10px] text-[#39FF14] border border-[#39FF14]/40 px-2 py-1 rounded hover:bg-[#39FF14]/10 transition-colors uppercase cursor-pointer"
                      >
                        {copiedCode ? "COPIED!" : "COPY CODE"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="w-full py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 transition-colors cursor-pointer"
                  >
                    CONTINUE TO DASHBOARD
                  </button>
                </div>
              ) : activeTab === "create" ? (
                <form onSubmit={handleCreateSubmit} className="space-y-4 my-4">
                  <InputField
                    id="teamName"
                    label="Team Name"
                    placeholder="Enter your team name"
                    value={createName}
                    onChange={(e) => {
                      setCreateName(e.target.value);
                      if (createError) setCreateError(null);
                    }}
                    error={createError}
                    required
                  />

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "CREATING..." : "CREATE TEAM"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(null)}
                      className="px-3 py-2.5 text-xs text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#242424] rounded-sm cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : null}
            </div>

            {!createdTeamData && activeTab !== "create" && (
              <div className="pt-6 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("create");
                    setCreateError(null);
                  }}
                  className="w-full py-3 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-pointer"
                >
                  CREATE TEAM
                </button>
              </div>
            )}
          </div>

          {/* CARD 2: JOIN A TEAM */}
          <div
            className={`bg-[#111111] border rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
              activeTab === "join"
                ? "border-[#39FF14] box-glow-neon"
                : "border-[#242424] hover:border-[#39FF14]/50"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded border border-[#39FF14]/30 bg-[#080808] flex items-center justify-center text-[#39FF14]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs text-[#16A34A] font-mono">[MEMBER]</span>
              </div>

              <h2 className="text-xl font-minecraftBold text-[#F5F5F5] mb-2 tracking-wide">
                JOIN A TEAM
              </h2>
              <p className="text-xs text-[#8A8A8A] mb-6 leading-relaxed">
                Enter the team code provided by your team leader.
              </p>

              {joinedTeamData ? (
                <div className="bg-[#080808] border border-[#39FF14]/40 p-5 rounded-sm space-y-4 my-4 animate-fade-in">
                  <div className="flex items-center space-x-2 text-[#39FF14]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-minecraftBold text-sm">TEAM JOINED</span>
                  </div>
                  <p className="text-xs text-[#8A8A8A]">
                    You have successfully joined <strong className="text-[#F5F5F5]">{joinedTeamData.name}</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={handleGoToDashboard}
                    className="w-full py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 transition-colors cursor-pointer"
                  >
                    CONTINUE TO DASHBOARD
                  </button>
                </div>
              ) : activeTab === "join" ? (
                <form onSubmit={handleJoinSubmit} className="space-y-4 my-4">
                  <InputField
                    id="joinCode"
                    label="Team Code"
                    placeholder="Enter team code (e.g. CCE-X7K9)"
                    value={joinCode}
                    onChange={(e) => {
                      setJoinCode(e.target.value);
                      if (joinError) setJoinError(null);
                    }}
                    error={joinError}
                    required
                  />

                  <div className="flex items-center space-x-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? "JOINING..." : "JOIN TEAM"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab(null)}
                      className="px-3 py-2.5 text-xs text-[#8A8A8A] hover:text-[#F5F5F5] border border-[#242424] rounded-sm cursor-pointer"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              ) : null}
            </div>

            {!joinedTeamData && activeTab !== "join" && (
              <div className="pt-6 border-t border-[#242424]">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("join");
                    setJoinError(null);
                  }}
                  className="w-full py-3 bg-[#111111] text-[#F5F5F5] border border-[#39FF14]/50 hover:border-[#39FF14] hover:text-[#39FF14] hover:shadow-[0_0_15px_rgba(57,255,20,0.2)] font-bold text-xs uppercase tracking-widest rounded-sm transition-all cursor-pointer"
                >
                  JOIN TEAM
                </button>
              </div>
            )}
          </div>
        </div>

        {/* TEAM RULES SECTION */}
        <div className="bg-[#111111] border border-[#242424] p-6 sm:p-8 rounded-sm">
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-[#39FF14] font-minecraftBold text-lg">&gt;</span>
            <h3 className="text-lg font-minecraftBold text-[#F5F5F5] tracking-wide uppercase">
              TEAM RULES
            </h3>
          </div>

          <ul className="space-y-3 text-xs sm:text-sm text-[#8A8A8A]">
            <li className="flex items-start space-x-2.5">
              <span className="text-[#39FF14] mt-0.5">&bull;</span>
              <span>Each participant can belong to only one team.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-[#39FF14] mt-0.5">&bull;</span>
              <span>The team creator becomes the Team Leader.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-[#39FF14] mt-0.5">&bull;</span>
              <span>Team members use their own accounts.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-[#39FF14] mt-0.5">&bull;</span>
              <span>Team scores are shared among all members.</span>
            </li>
            <li className="flex items-start space-x-2.5">
              <span className="text-[#39FF14] mt-0.5">&bull;</span>
              <span>Choose your team carefully before the competition starts.</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
