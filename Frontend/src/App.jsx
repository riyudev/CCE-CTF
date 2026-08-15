import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import TeamSetupPage from "./components/TeamSetupPage";
import DashboardPage from "./components/DashboardPage";
import ChallengesPage from "./components/ChallengesPage";
import ChallengeDetailPage from "./components/ChallengeDetailPage";
import LeaderboardPage from "./components/LeaderboardPage";
import Footer from "./components/Footer";
import { initialChallenges } from "./data/challenges";
import { api, getToken, setToken, getStoredUser, setStoredUser } from "./services/api";
import "./App.css";

function App() {
  const getCleanPath = (path) => {
    if (!path) return "/";
    const clean = path.toLowerCase().replace(/\/+$/, "");
    return clean === "" ? "/" : clean;
  };

  const [currentPath, setCurrentPath] = useState(() => getCleanPath(window.location.pathname));
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken() && getStoredUser()));
  const [userTeam, setUserTeam] = useState(() => getStoredUser()?.team || null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Global challenge state persistent across navigation
  const [challenges, setChallenges] = useState(initialChallenges);

  // Load authenticated user session on mount
  useEffect(() => {
    async function loadAuth() {
      const token = getToken();

      if (!token || token === "demo_admin_token_2026") {
        setToken(null);
        setStoredUser(null);
        setCurrentUser(null);
        setIsLoggedIn(false);
        setIsAuthLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.user) {
          setCurrentUser(res.user);
          setIsLoggedIn(true);
          setStoredUser(res.user);
          if (res.user.team) setUserTeam(res.user.team);
        } else {
          throw new Error("Invalid user session");
        }
      } catch (err) {
        console.log("[APP] Auth restore failed:", err.message);
        setToken(null);
        setStoredUser(null);
        setCurrentUser(null);
        setIsLoggedIn(false);
        setUserTeam(null);
      } finally {
        setIsAuthLoading(false);
      }
    }
    loadAuth();
  }, []);

  // Sync state with browser navigation back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getCleanPath(window.location.pathname));
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const navigateTo = (path) => {
    const cleanPath = getCleanPath(path);
    if (cleanPath === currentPath) return;

    setCurrentPath(cleanPath);
    window.history.pushState({}, "", cleanPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setToken(null);
    setStoredUser(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    setUserTeam(null);
    showToast("Logged out successfully.");
    navigateTo("/login");
  };

  const handleSolveChallenge = (id) => {
    setChallenges((prev) =>
      prev.map((item) =>
        String(item.id || item._id) === String(id) ? { ...item, solved: true } : item
      )
    );
  };

  const isChallengeDetailRoute = currentPath.startsWith("/challenges/");
  const detailChallengeId = isChallengeDetailRoute
    ? currentPath.replace("/challenges/", "")
    : null;

  const isAdminRoute = currentPath.startsWith("/admin");

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center font-spaceMonoBold text-[#39FF14] text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          <span>&gt; RESTORING CTF SESSION...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] font-spaceMonoBold flex flex-col justify-between selection:bg-[#39FF14] selection:text-[#080808]">
      {/* Hide Navbar on Admin pages */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          navigateTo={navigateTo}
          currentUser={currentUser?.username || currentUser?.name || ""}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
        />
      )}

      {/* System Toast Notification */}
      {toastMessage && (
        <div className="bg-[#111111] border-b border-[#39FF14]/40 py-2.5 px-4 text-center text-xs text-[#39FF14] flex items-center justify-center space-x-2 animate-fade-in z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
          <span>&gt; SYSTEM NOTICE: {toastMessage}</span>
        </div>
      )}

      {/* Main Content Area Routing */}
      <main className="flex-1">
        {currentPath === "/login" ? (
          <LoginPage
            navigateTo={navigateTo}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              setIsLoggedIn(true);
              if (user?.team) setUserTeam(user.team);
            }}
          />
        ) : currentPath === "/register" ? (
          <RegisterPage
            navigateTo={navigateTo}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              setIsLoggedIn(true);
            }}
          />
        ) : currentPath === "/team" ? (
          <TeamSetupPage
            userTeam={userTeam}
            setUserTeam={setUserTeam}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        ) : currentPath === "/dashboard" ? (
          <DashboardPage
            userTeam={userTeam}
            navigateTo={navigateTo}
            showToast={showToast}
            currentUser={currentUser}
          />
        ) : currentPath === "/challenges" ? (
          <ChallengesPage navigateTo={navigateTo} />
        ) : isChallengeDetailRoute ? (
          <ChallengeDetailPage
            challengeId={detailChallengeId}
            onSolveChallenge={handleSolveChallenge}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        ) : currentPath === "/leaderboard" ? (
          <LeaderboardPage userTeamName={userTeam?.name || ""} />
        ) : isAdminRoute ? (
          <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
            <div className="max-w-md bg-[#111111] border border-[#39FF14]/40 p-8 rounded-sm space-y-4 box-glow-neon">
              <div className="text-[#39FF14] text-xl font-minecraftBold uppercase">&gt; STANDALONE ADMIN PORTAL</div>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                The Admin Management Console is now hosted as an independent web application.
              </p>
              <button
                onClick={() => navigateTo("/")}
                className="w-full py-2.5 bg-[#39FF14] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#39FF14]/90 cursor-pointer"
              >
                RETURN TO HOME
              </button>
            </div>
          </div>
        ) : (
          <>
            <HeroSection
              onJoinClick={() => navigateTo("/register")}
              onViewLeaderboardClick={() => navigateTo("/leaderboard")}
            />
          </>
        )}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
