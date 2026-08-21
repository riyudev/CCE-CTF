import React from "react";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", altPath: "/admin" },
  { name: "Users", path: "/users", altPath: "/admin/users" },
  { name: "Teams", path: "/teams", altPath: "/admin/teams" },
  { name: "Team Solves", path: "/team-solves", altPath: "/admin/team-solves" },
  { name: "Challenges", path: "/challenges", altPath: "/admin/challenges" },
  { name: "Submissions", path: "/submissions", altPath: "/admin/submissions" },
  { name: "Leaderboard", path: "/leaderboard", altPath: "/admin/leaderboard" },
  { name: "Competition", path: "/competition", altPath: "/admin/competition" },
];

export default function AdminSidebar({ currentPath, navigateTo, onLogout }) {
  const handleLinkClick = (path) => {
    navigateTo(path);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigateTo("/login");
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#111111] border-r border-[#242424] flex flex-col font-spaceMonoBold">
      {/* Admin Header */}
      <div
        onClick={() => handleLinkClick("/dashboard")}
        className="flex items-center space-x-3 px-4 py-4 border-b border-[#242424] shrink-0 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded border border-[#39FF14]/40 bg-[#080808] flex items-center justify-center text-[#39FF14] font-bold group-hover:border-[#39FF14] transition-colors shadow-[0_0_8px_rgba(57,255,20,0.15)]">
          <span className="text-sm font-minecraftBold">&gt;_</span>
        </div>
        <div>
          <h2 className="text-sm font-minecraftBold text-[#F5F5F5] tracking-wider uppercase group-hover:text-[#39FF14] transition-colors">
            CCE ADMIN
          </h2>
          <span className="text-[10px] text-[#39FF14] block">PORTAL v2026</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
        {menuItems.map((item) => {
          const isActive =
            currentPath === item.path ||
            currentPath === item.altPath ||
            (item.path === "/dashboard" && (currentPath === "/" || currentPath === ""));

          return (
            <button
              key={item.path}
              onClick={() => handleLinkClick(item.path)}
              className={`w-full text-left px-3 py-2.5 rounded-sm text-xs tracking-wider uppercase transition-all cursor-pointer flex items-center justify-between ${
                isActive
                  ? "bg-[#39FF14]/10 text-[#39FF14] border-l-4 border-[#39FF14] font-bold"
                  : "text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#080808]"
              }`}
            >
              <span>&gt; {item.name}</span>
              {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="shrink-0 p-4 border-t border-[#242424]">
        <button
          onClick={handleLogoutClick}
          className="w-full text-center py-2.5 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:border-[#FF4D4D] hover:text-[#FF4D4D] text-xs font-bold uppercase tracking-widest rounded-sm transition-all cursor-pointer"
        >
          LOGOUT
        </button>
      </div>
    </aside>
  );
}
