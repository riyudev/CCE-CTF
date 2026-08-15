import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { api } from "../services/api";

export default function AdminUsers({ currentPath, navigateTo, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res.users) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error("[ADMIN USERS] Error fetching users:", err.message);
      setErrorMsg(err.message || "Failed to load users from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    try {
      await api.admin.deleteUser(deleteTarget._id);
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      setErrorMsg(err.message || "Failed to delete user.");
      setDeleteTarget(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const teamName = typeof u.team === "object" ? u.team?.name : u.team || "";
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.username || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      teamName.toLowerCase().includes(q)
    );
  });

  return (
    <AdminLayout currentPath={currentPath} navigateTo={navigateTo} onLogout={onLogout}>
      <div className="border-b border-[#242424] pb-6">
        <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-1">
          USERS MANAGEMENT
        </h1>
        <p className="text-xs text-[#8A8A8A]">
          Manage and search registered participant accounts in MongoDB.
        </p>
      </div>

      {errorMsg && (
        <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D]">
          &gt; {errorMsg}
        </div>
      )}

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
                <th className="py-3 px-4">JOINED</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242424]/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#39FF14] font-mono">
                    &gt; FETCHING USERS FROM MONGODB...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((u) => {
                  const teamDisplay = u.team?.name || u.team || "NO TEAM";
                  const dateDisplay = u.createdAt
                    ? new Date(u.createdAt).toLocaleDateString()
                    : "ACTIVE";

                  return (
                    <tr key={u._id || u.username} className="hover:bg-[#080808]/50 transition-colors">
                      <td className="py-3 px-4 font-bold text-[#F5F5F5]">{u.name}</td>
                      <td className="py-3 px-4 text-[#39FF14] font-mono">@{u.username}</td>
                      <td className="py-3 px-4 text-[#8A8A8A]">{u.email}</td>
                      <td className="py-3 px-4 text-[#F5F5F5]">{teamDisplay}</td>
                      <td className="py-3 px-4 text-[#8A8A8A] uppercase font-bold text-[10px]">
                        <span
                          className={`px-2 py-0.5 rounded ${
                            u.role === "admin"
                              ? "bg-[#39FF14]/10 text-[#39FF14] border border-[#39FF14]/30"
                              : u.role === "leader"
                                ? "bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/30"
                                : "bg-[#080808] text-[#8A8A8A] border border-[#242424]"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#8A8A8A] font-mono text-[10px]">{dateDisplay}</td>
                      <td className="py-3 px-4 text-right">
                        {u.role !== "admin" && (
                          <button
                            onClick={() => setDeleteTarget(u)}
                            className="px-2.5 py-1 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:border-[#FF4D4D] hover:text-[#FF4D4D] text-[10px] uppercase font-bold rounded-sm cursor-pointer"
                          >
                            DELETE
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8A8A8A]">
                    No matching users found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete User Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-[#080808]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#FF4D4D] rounded-sm p-6 max-w-sm w-full space-y-4 box-glow-neon">
            <h3 className="text-base font-minecraftBold text-[#FF4D4D] uppercase">
              CONFIRM DELETE USER
            </h3>
            <p className="text-xs text-[#F5F5F5] leading-relaxed font-spaceMonoBold">
              Are you sure you want to delete user <strong>@{deleteTarget.username}</strong> ({deleteTarget.name})?
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={handleDeleteUser}
                className="flex-1 py-2 bg-[#FF4D4D] text-[#080808] font-bold text-xs uppercase rounded-sm hover:bg-[#FF4D4D]/90 cursor-pointer"
              >
                DELETE
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2 bg-[#080808] text-[#8A8A8A] border border-[#242424] hover:text-[#F5F5F5] font-bold text-xs uppercase rounded-sm cursor-pointer"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
