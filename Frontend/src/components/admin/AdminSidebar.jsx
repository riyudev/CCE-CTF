import React from "react";

export default function AdminSidebar({ currentPath, navigateTo, onCloseMobile, onLogout }) {
  const menuItems = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Teams", path: "/admin/teams" },
    { name: "Challenges", path: "/admin/challenges" },
    { name: "Submissions", path: "/admin/submissions" },
    { name: "Leaderboard", path: "/admin/leaderboard" },
    { name: "Competition", path: "/admin/competition" },
  ];

  const handleLinkClick = (path) => {
    navigateTo(path);
    if (onCloseMobile) onCloseMobile();
  };

  const handleLogoutClick = () => {
    if (onCloseMobile) onCloseMobile();
    if (onLogout) {
      onLogout();
    } else {
      navigateTo("/admin/login");
    }
  };

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#242424] min-h-screen flex flex-col justify-between p-4 font-spaceMonoBold">
      <div>
        {/* Admin Header */}
        <div className="flex items-center space-x-3 px-3 py-4 border-b border-[#242424] mb-6">
          <div className="w-8 h-8 rounded border border-[#39FF14]/40 bg-[#080808] flex items-center justify-center text-[#39FF14] font-bold shadow-[0_0_8px_rgba(57,255,20,0.15)]">
            <span className="text-sm font-minecraftBold">&gt;_</span>
          </div>
          <div>
            <h2 className="text-sm font-minecraftBold text-[#F5F5F5] tracking-wider uppercase">
              CCE ADMIN
            </h2>
            <span className="text-[10px] text-[#39FF14] block">PORTAL v2026</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = currentPath === item.path;
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
      </div>

      {/* Footer / LOGOUT */}
      <div className="pt-4 border-t border-[#242424]">
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
