import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import { initialAdminUsers } from "../../data/adminData";

export default function AdminUsers({ currentPath, navigateTo }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = initialAdminUsers.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.team.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          USERS MANAGEMENT
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Manage and search registered participant accounts.
        </p>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          placeholder="Search users by name, username, email, or team..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#111111] text-[#F5F5F5] border border-[#242424] focus:border-[#39FF14] text-xs rounded-sm px-4 py-2.5 outline-none placeholder:text-[#555555]"
        />
      </div>

      {/* Users Table */}
      <div className="bg-[#111111] border border-[#242424] rounded-sm overflow-hidden box-glow-neon">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#080808] border-b border-[#242424] text-[#8A8A8A] uppercase">
                <th className="py-3 px-4">NAME</th>
                <th className="py-3 px-4">USERNAME</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">TEAM</th>
                <th className="py-3 px-4">ROLE</th>
                <th className="py-3 px-4 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#080808]/50 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F5F5F5]">{u.name}</td>
                    <td className="py-3 px-4 text-[#39FF14] font-mono">@{u.username}</td>
                    <td className="py-3 px-4 text-[#8A8A8A]">{u.email}</td>
                    <td className="py-3 px-4 text-[#F5F5F5]">{u.team}</td>
                    <td className="py-3 px-4 text-[#8A8A8A]">{u.role}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#8A8A8A]">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
