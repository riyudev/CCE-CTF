import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import HighlightsSection from "./components/HighlightsSection";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import TeamSetupPage from "./components/TeamSetupPage";
import DashboardPage from "./components/DashboardPage";
import ChallengesPage from "./components/ChallengesPage";
import ChallengeDetailPage from "./components/ChallengeDetailPage";
import LeaderboardPage from "./components/LeaderboardPage";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminTeams from "./components/admin/AdminTeams";
import AdminChallenges from "./components/admin/AdminChallenges";
import AdminSubmissions from "./components/admin/AdminSubmissions";
import AdminLeaderboard from "./components/admin/AdminLeaderboard";
import AdminCompetition from "./components/admin/AdminCompetition";
import Footer from "./components/Footer";
import { initialChallenges } from "./data/challenges";
import { initialCompetitionSettings } from "./data/adminData";
import { api, getToken, setToken } from "./services/api";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname || "/");
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userTeam, setUserTeam] = useState(null);

  // Global challenge state persistent across navigation
  const [challenges, setChallenges] = useState(initialChallenges);

  // Global admin competition state
  const [competitionSettings, setCompetitionSettings] = useState(initialCompetitionSettings);

  // Load authenticated user session on mount
  useEffect(() => {
    async function loadAuth() {
      const token = getToken();
      if (!token) return;

      try {
        const res = await api.auth.getMe();
        if (res.user) {
          setCurrentUser(res.user);
          setIsLoggedIn(true);
          if (res.user.team) {
            setUserTeam(res.user.team);
          }
        }
      } catch (err) {
        console.log("[APP] Auth restore failed:", err.message);
        setToken(null);
      }
    }
    loadAuth();
  }, []);

  // Sync state with browser navigation back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || "/");
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
    if (path === currentPath) return;

    setCurrentPath(path);
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setToken(null);
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
  const isAdminAuthenticated = isLoggedIn && currentUser?.role === "admin";

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] font-spaceMonoBold flex flex-col justify-between selection:bg-[#39FF14] selection:text-[#080808]">
      {/* Hide Navbar on Admin pages */}
      {!isAdminRoute && (
        <Navbar
          currentPath={currentPath}
          navigateTo={navigateTo}
          currentUser={currentUser?.username || currentUser?.name || "Reyu"}
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
            navigateTo={(path) => {
              setIsLoggedIn(true);
              navigateTo(path);
            }}
            onAuthSuccess={(user) => {
              setCurrentUser(user);
              setIsLoggedIn(true);
              if (user?.team) setUserTeam(user.team);
            }}
          />
        ) : currentPath === "/register" ? (
          <RegisterPage
            navigateTo={(path) => {
              setIsLoggedIn(true);
              navigateTo(path);
            }}
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
          <ChallengesPage
            challenges={challenges}
            navigateTo={navigateTo}
          />
        ) : isChallengeDetailRoute ? (
          <ChallengeDetailPage
            challengeId={detailChallengeId}
            challenges={challenges}
            onSolveChallenge={handleSolveChallenge}
            navigateTo={navigateTo}
            showToast={showToast}
          />
        ) : currentPath === "/leaderboard" ? (
          <LeaderboardPage userTeamName={userTeam?.name || "Cyber Warriors"} />
        ) : isAdminRoute ? (
          currentPath === "/admin/login" || !isAdminAuthenticated ? (
            <AdminLogin
              onAdminLogin={(user) => {
                setIsLoggedIn(true);
                setCurrentUser(user || { name: "Admin", username: "admin", role: "admin" });
                navigateTo("/admin");
              }}
            />
          ) : currentPath === "/admin/users" ? (
            <AdminUsers currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
          ) : currentPath === "/admin/teams" ? (
            <AdminTeams currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
          ) : currentPath === "/admin/challenges" ? (
            <AdminChallenges
              currentPath={currentPath}
              navigateTo={navigateTo}
              onLogout={handleLogout}
              challenges={challenges}
              setChallenges={setChallenges}
            />
          ) : currentPath === "/admin/submissions" ? (
            <AdminSubmissions currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
          ) : currentPath === "/admin/leaderboard" ? (
            <AdminLeaderboard currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
          ) : currentPath === "/admin/competition" ? (
            <AdminCompetition
              currentPath={currentPath}
              navigateTo={navigateTo}
              onLogout={handleLogout}
              competitionSettings={competitionSettings}
              setCompetitionSettings={setCompetitionSettings}
            />
          ) : (
            <AdminDashboard
              currentPath={currentPath}
              navigateTo={navigateTo}
              onLogout={handleLogout}
              competitionSettings={competitionSettings}
              setCompetitionSettings={setCompetitionSettings}
            />
          )
        ) : (
          <>
            <HeroSection
              onJoinClick={() => navigateTo("/register")}
              onViewLeaderboardClick={() => navigateTo("/leaderboard")}
            />
            <HighlightsSection onCardClick={(id) => navigateTo(`/${id}`)} />
          </>
        )}
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default App;
