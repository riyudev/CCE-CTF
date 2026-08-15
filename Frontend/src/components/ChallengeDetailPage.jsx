import React, { useState, useEffect } from "react";
import { api, getFileDownloadUrl, getStoredUser } from "../services/api";

export default function ChallengeDetailPage({
  challengeId,
  onSolveChallenge,
  navigateTo,
  showToast,
}) {
  const [challenge, setChallenge] = useState(null);
  const [blockedState, setBlockedState] = useState(null);
  const [blockedMessage, setBlockedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [inputFlag, setInputFlag] = useState("");
  const [submissionResult, setSubmissionResult] = useState(null); // 'correct' | 'incorrect' | null
  const [resultMessage, setResultMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadySolved, setIsAlreadySolved] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      setBlockedState(null);
      try {
        const res = await api.challenges.getById(challengeId);
        if (res.challenge) {
          setChallenge(res.challenge);
        }

        try {
          const solvedRes = await api.challenges.getSolved();
          if (solvedRes.solvedChallengeIds?.includes(String(challengeId))) {
            setIsAlreadySolved(true);
          }
        } catch {
          // optional if not logged in
        }
      } catch (err) {
        if (
          err.message?.includes("ended") ||
          err.message?.includes("not started")
        ) {
          setBlockedState(
            err.message.includes("ended") ? "ENDED" : "NOT_STARTED"
          );
          setBlockedMessage(err.message);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [challengeId]);

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem-4rem)] py-12 px-4 bg-[#080808] font-spaceMonoBold text-center">
        <p className="text-xs text-[#39FF14] font-mono pt-24">&gt; LOADING CHALLENGE...</p>
      </section>
    );
  }

  if (blockedState) {
    const isEnded = blockedState === "ENDED";
    return (
      <section className="min-h-[calc(100vh-4rem-4rem)] py-12 px-4 bg-[#080808] font-spaceMonoBold text-center">
        <div
          className={`max-w-md mx-auto bg-[#111111] border p-8 rounded-sm ${
            isEnded ? "border-[#FF4D4D]/40" : "border-[#38BDF8]/40"
          }`}
        >
          <h2 className="text-xl font-minecraftBold text-[#F5F5F5] mb-4 uppercase">
            {isEnded ? "CCE CTF CHALLENGES ENDED" : "CCE CTF COMPETITION UPCOMING"}
          </h2>
          <p className="text-xs text-[#8A8A8A] mb-6">{blockedMessage}</p>
          <button
            onClick={() => navigateTo("/challenges")}
            className="px-4 py-2 bg-[#39FF14] text-[#080808] text-xs font-bold uppercase rounded-sm cursor-pointer"
          >
            RETURN TO CHALLENGES
          </button>
        </div>
      </section>
    );
  }

  if (!challenge) {
    return (
      <section className="min-h-[calc(100vh-4rem-4rem)] py-12 px-4 bg-[#080808] font-spaceMonoBold text-center">
        <div className="max-w-md mx-auto bg-[#111111] border border-[#242424] p-8 rounded-sm">
          <h2 className="text-xl font-minecraftBold text-[#FF4D4D] mb-4">
            CHALLENGE NOT FOUND
          </h2>
          <p className="text-xs text-[#8A8A8A] mb-6">
            The requested challenge does not exist or has been removed.
          </p>
          <button
            onClick={() => navigateTo("/challenges")}
            className="px-4 py-2 bg-[#39FF14] text-[#080808] text-xs font-bold uppercase rounded-sm cursor-pointer"
          >
            RETURN TO CHALLENGES
          </button>
        </div>
      </section>
    );
  }

  const { title, category, difficulty, points, description, fileUrl, file } = challenge;
  const isSolved = challenge.solved || isAlreadySolved || submissionResult === "correct";

  const handleDownload = () => {
    const downloadUrl = getFileDownloadUrl(fileUrl);
    if (!downloadUrl) {
      if (showToast) showToast("No file available for this challenge.");
      return;
    }
    window.open(downloadUrl, "_blank", "noopener,noreferrer");
    if (showToast) showToast(`Downloading ${fileUrl.split("/").pop()}...`);
  };

  const handleSubmitFlag = async (e) => {
    e.preventDefault();
    const trimmed = inputFlag.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      const res = await api.challenges.submitFlag(challenge._id || challenge.id, trimmed);
      if (res.correct) {
        setSubmissionResult("correct");
        setResultMessage(res.message || "Correct flag! Team points awarded.");
        setIsAlreadySolved(true);
        if (onSolveChallenge) onSolveChallenge(challenge._id || challenge.id);
        if (showToast) showToast(res.message || "Correct flag!");
      } else {
        setSubmissionResult("incorrect");
        setResultMessage(res.message || "Incorrect flag. Try again.");
      }
    } catch (err) {
      setSubmissionResult("incorrect");
      setResultMessage(err.message || "Incorrect flag. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const difficultyColors = {
    EASY: "border-[#16A34A]/40 text-[#16A34A] bg-[#16A34A]/10",
    MEDIUM: "border-[#EAB308]/40 text-[#EAB308] bg-[#EAB308]/10",
    HARD: "border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10",
  };

  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative max-w-4xl mx-auto z-10 space-y-8">
        <div>
          <button
            onClick={() => navigateTo("/challenges")}
            className="inline-flex items-center space-x-2 text-xs text-[#8A8A8A] hover:text-[#39FF14] transition-colors py-1 cursor-pointer"
          >
            <span>&larr;</span>
            <span>BACK TO CHALLENGES</span>
          </button>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-6 sm:p-8 rounded-sm box-glow-neon space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#242424] pb-6 gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-mono text-[#8A8A8A] uppercase">
                  CATEGORY: <strong className="text-[#F5F5F5]">{category}</strong>
                </span>
                <span className="text-[#242424]">|</span>
                <span className="text-xs font-mono text-[#8A8A8A] uppercase">
                  DIFFICULTY:{" "}
                  <strong className={difficultyColors[difficulty]?.split(" ")[1]}>
                    {difficulty}
                  </strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-minecraftBold text-[#F5F5F5] uppercase tracking-wide">
                {title}
              </h1>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
              <div className="text-2xl sm:text-3xl font-minecraftBold text-[#39FF14] text-glow-neon">
                {points} <span className="text-xs text-[#8A8A8A] font-spaceMonoBold">PTS</span>
              </div>
              {isSolved ? (
                <span className="inline-flex items-center space-x-1.5 text-xs text-[#39FF14] bg-[#39FF14]/10 border border-[#39FF14]/40 px-3 py-1 rounded">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-bold">SOLVED</span>
                </span>
              ) : (
                <span className="text-xs text-[#8A8A8A] bg-[#080808] border border-[#242424] px-3 py-1 rounded">
                  UNSOLVED
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-minecraftBold text-[#F5F5F5] uppercase tracking-wider text-[#39FF14]/90">
              &gt; DESCRIPTION
            </h2>
            <div className="bg-[#080808] border border-[#242424] p-4 sm:p-5 rounded-sm text-sm text-[#F5F5F5] leading-relaxed">
              {description}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-minecraftBold text-[#F5F5F5] uppercase tracking-wider text-[#39FF14]/90">
              &gt; CHALLENGE FILES
            </h2>
            <div className="bg-[#080808] border border-[#242424] p-4 rounded-sm flex items-center justify-between">
              {fileUrl || file ? (
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded border border-[#242424] bg-[#111111] flex items-center justify-center text-lg">
                    📄
                  </div>
                  <div>
                    <span className="text-sm font-bold text-[#F5F5F5] block">
                      {fileUrl || file?.name}
                    </span>
                    <span className="text-[10px] text-[#8A8A8A] font-mono">
                      ATTACHMENT AVAILABLE
                    </span>
                  </div>
                </div>
              ) : (
                <span className="text-xs text-[#8A8A8A] italic">
                  No files are required for this challenge.
                </span>
              )}

              {(fileUrl || file) && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-4 py-2 bg-[#111111] text-[#39FF14] border border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-[#080808] text-xs uppercase tracking-wider font-bold rounded-sm transition-all cursor-pointer"
                >
                  DOWNLOAD
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[#242424]">
            <h2 className="text-sm font-minecraftBold text-[#F5F5F5] uppercase tracking-wider text-[#39FF14]/90">
              &gt; SUBMIT FLAG
            </h2>

            {isSolved ? (
              <div className="bg-[#39FF14]/10 border border-[#39FF14] p-6 rounded-sm text-center space-y-2 animate-fade-in">
                <div className="flex items-center justify-center space-x-2 text-[#39FF14]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-lg font-minecraftBold tracking-wider uppercase">
                    ✓ CORRECT FLAG
                  </span>
                </div>
                <p className="text-sm font-minecraftBold text-[#39FF14]">
                  +{points} POINTS EARNED FOR YOUR TEAM
                </p>
                <p className="text-xs text-[#8A8A8A] font-spaceMonoBold pt-2">
                  Challenge completed. Great work!
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFlag} className="space-y-4">
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <input
                    type="text"
                    placeholder="CCE{enter_flag_here}"
                    value={inputFlag}
                    onChange={(e) => {
                      setInputFlag(e.target.value);
                      if (submissionResult) setSubmissionResult(null);
                    }}
                    className="flex-1 bg-[#080808] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30 text-sm rounded-sm px-4 py-3 outline-none placeholder:text-[#555555] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="py-3 px-8 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "VERIFYING..." : "SUBMIT FLAG"}
                  </button>
                </div>

                {submissionResult === "incorrect" && (
                  <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D] flex items-center space-x-2 animate-fade-in font-spaceMonoBold">
                    <span>✕</span>
                    <span>{resultMessage || "INCORRECT FLAG. Try again."}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
