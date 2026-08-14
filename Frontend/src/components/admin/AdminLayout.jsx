import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({ currentPath, navigateTo, onLogout, children }) {
  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] font-spaceMonoBold">
      {/* Fixed left sidebar — always visible */}
      <AdminSidebar
        currentPath={currentPath}
        navigateTo={navigateTo}
        onLogout={onLogout}
      />

      {/* Main content offset by sidebar width */}
      <main className="min-h-screen pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}
