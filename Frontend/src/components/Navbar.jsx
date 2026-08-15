import React, { useState } from "react";

export default function Navbar({
  currentPath = "/",
  navigateTo,
  currentUser = "Reyu",
  isLoggedIn = true,
  onLogout,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Challenges", path: "/challenges" },
    { name: "Leaderboard", path: "/leaderboard" },
    { name: "Team", path: "/team" },
  ];

  const handleNavClick = (path) => {
    if (navigateTo) {
      navigateTo(path);
    }
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigateTo("/login");
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080808]/90 backdrop-blur-md border-b border-[#242424] w-full font-spaceMonoBold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side: Logo */}
          <div
            onClick={() => handleNavClick(isLoggedIn ? "/dashboard" : "/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded border border-[#39FF14]/40 bg-[#111111] flex items-center justify-center text-[#39FF14] font-bold group-hover:border-[#39FF14] transition-colors shadow-[0_0_8px_rgba(57,255,20,0.15)]">
              <span className="text-sm font-minecraftBold">&gt;_</span>
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-minecraftBold text-[#F5F5F5] tracking-wider group-hover:text-[#39FF14] transition-colors">
                CCE CTF
              </span>
              <span className="text-[10px] text-[#39FF14] bg-[#39FF14]/10 px-1.5 py-0.5 rounded border border-[#39FF14]/30 hidden sm:inline-block">
                v2026
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links — logged-in users only */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = currentPath === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNavClick(item.path)}
                    className={`text-sm tracking-wider uppercase transition-colors relative py-1 cursor-pointer ${
                      isActive
                        ? "text-[#39FF14] font-bold"
                        : "text-[#8A8A8A] hover:text-[#F5F5F5]"
                    }`}
                  >
                    {item.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#39FF14] shadow-[0_0_8px_#39FF14]" />
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Side: User Profile & LOGOUT or LOGIN */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-[#111111] border border-[#242424] px-3 py-1.5 rounded-sm text-xs text-[#F5F5F5]">
                  <span className="w-2 h-2 rounded-full bg-[#39FF14]" />
                  <span className="font-bold tracking-wider">[ {currentUser.toUpperCase()} ]</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs uppercase tracking-widest px-3 py-1.5 bg-[#111111] text-[#8A8A8A] border border-[#242424] hover:border-[#FF4D4D] hover:text-[#FF4D4D] rounded-sm transition-all duration-200 cursor-pointer"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick("/login")}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-sm border transition-all duration-200 cursor-pointer ${
                  currentPath === "/login"
                    ? "bg-[#39FF14] text-[#080808] border-[#39FF14] font-bold shadow-[0_0_12px_rgba(57,255,20,0.4)]"
                    : "bg-[#111111] text-[#39FF14] border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-[#080808] hover:shadow-[0_0_12px_rgba(57,255,20,0.4)]"
                }`}
              >
                [ LOGIN ]
              </button>
            )}
          </div>

          {/* Mobile: login when logged out, menu toggle when logged in */}
          <div className="flex md:hidden">
            {isLoggedIn ? (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                type="button"
                className="text-[#8A8A8A] hover:text-[#39FF14] focus:outline-none p-2 rounded-sm border border-[#242424] bg-[#111111]"
                aria-label="Toggle Menu"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            ) : (
              <button
                onClick={() => handleNavClick("/login")}
                className={`text-xs uppercase tracking-widest px-4 py-2 rounded-sm border transition-all duration-200 cursor-pointer ${
                  currentPath === "/login"
                    ? "bg-[#39FF14] text-[#080808] border-[#39FF14] font-bold shadow-[0_0_12px_rgba(57,255,20,0.4)]"
                    : "bg-[#111111] text-[#39FF14] border-[#39FF14]/50 hover:bg-[#39FF14] hover:text-[#080808]"
                }`}
              >
                [ LOGIN ]
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation — logged-in users only */}
      {isLoggedIn && mobileMenuOpen && (
        <div className="md:hidden bg-[#111111] border-b border-[#242424] px-4 pt-2 pb-6 space-y-3">
          {navItems.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-3 py-2 text-sm uppercase rounded-sm transition-colors ${
                  isActive
                    ? "bg-[#39FF14]/10 text-[#39FF14] border-l-2 border-[#39FF14]"
                    : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#080808]"
                }`}
              >
                &gt; {item.name}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#242424]">
            <button
              onClick={handleLogout}
              className="w-full text-center py-2.5 bg-[#111111] text-[#FF4D4D] border border-[#FF4D4D]/50 font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#FF4D4D] hover:text-[#080808] transition-colors"
            >
              LOGOUT ({currentUser.toUpperCase()})
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
