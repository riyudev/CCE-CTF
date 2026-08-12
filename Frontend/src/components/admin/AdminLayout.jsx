import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ currentPath, navigateTo, onLogout, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] font-spaceMonoBold flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AdminSidebar currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout} />
      </div>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#111111] border-b border-[#242424] px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <span className="font-minecraftBold text-base text-[#39FF14]">&gt;_ CCE ADMIN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 border border-[#242424] bg-[#080808] text-[#8A8A8A] hover:text-[#39FF14] rounded-sm text-xs"
        >
          {mobileMenuOpen ? "CLOSE MENU" : "NAV MENU"}
        </button>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#080808]/95 pt-16">
          <AdminSidebar
            currentPath={currentPath}
            navigateTo={navigateTo}
            onLogout={onLogout}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
