import React, { useState, useEffect } from "react";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminUsers from "./components/AdminUsers";
import AdminTeams from "./components/AdminTeams";
import AdminTeamSolves from "./components/AdminTeamSolves";
import AdminChallenges from "./components/AdminChallenges";
import AdminSubmissions from "./components/AdminSubmissions";
import AdminLeaderboard from "./components/AdminLeaderboard";
import AdminCompetition from "./components/AdminCompetition";
import { api, getToken, setToken, getStoredUser, setStoredUser } from "./services/api";
import "./App.css";

function App() {
  const getCleanPath = (path) => {
    if (!path) return "/";
    let clean = path.toLowerCase().replace(/\/+$/, "");
    if (clean.startsWith("/admin")) {
      clean = clean.replace("/admin", "");
    }
    return clean === "" ? "/" : clean;
  };

  const [currentPath, setCurrentPath] = useState(() => getCleanPath(window.location.pathname));
  const [toastMessage, setToastMessage] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(getToken() && getStoredUser()));
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [competitionSettings, setCompetitionSettings] = useState(null);

  useEffect(() => {
    async function loadAuth() {
      const token = getToken();

      if (!token) {
        setToken(null);
        setStoredUser(null);
        setCurrentUser(null);
        setIsLoggedIn(false);
        setIsAuthLoading(false);
        return;
      }

      try {
        const res = await api.auth.getMe();
        if (res.user && res.user.role === "admin") {
          setCurrentUser(res.user);
          setIsLoggedIn(true);
          setStoredUser(res.user);
        } else {
          throw new Error("User does not have admin privileges");
        }
      } catch (err) {
        console.log("[ADMIN APP] Auth check failed:", err.message);
        setToken(null);
        setStoredUser(null);
        setCurrentUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsAuthLoading(false);
      }
    }
    loadAuth();
  }, []);

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
    window.history.pushState({}, "", path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    setToken(null);
    setStoredUser(null);
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast("Logged out successfully.");
    navigateTo("/login");
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center font-spaceMonoBold text-[#39FF14] text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-ping" />
          <span>&gt; RESTORING ADMIN SESSION...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || !currentUser || currentUser.role !== "admin") {
    return (
      <AdminLogin
        onAdminLogin={(user) => {
          setIsLoggedIn(true);
          setCurrentUser(user);
          navigateTo("/dashboard");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] font-spaceMonoBold selection:bg-[#39FF14] selection:text-[#080808]">
      {toastMessage && (
        <div className="fixed top-0 left-0 right-0 bg-[#111111] border-b border-[#39FF14]/40 py-2.5 px-4 text-center text-xs text-[#39FF14] flex items-center justify-center space-x-2 animate-fade-in z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14] animate-ping" />
          <span>&gt; SYSTEM NOTICE: {toastMessage}</span>
        </div>
      )}

      <main className="min-h-screen">
        {currentPath === "/users" ? (
          <AdminUsers currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/teams" ? (
          <AdminTeams currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/team-solves" ? (
          <AdminTeamSolves currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/challenges" ? (
          <AdminChallenges currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/submissions" ? (
          <AdminSubmissions currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/leaderboard" ? (
          <AdminLeaderboard currentPath={currentPath} navigateTo={navigateTo} onLogout={handleLogout} />
        ) : currentPath === "/competition" ? (
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
        )}
      </main>
    </div>
  );
}

export default App;
