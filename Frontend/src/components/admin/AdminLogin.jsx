import React, { useState } from "react";
import InputField from "../InputField";

export default function AdminLogin({ onAdminLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError("Username and password are required");
      return;
    }

    setError(null);
    if (onAdminLogin) {
      onAdminLogin();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#080808] font-spaceMonoBold">
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#111111] border border-[#242424] rounded-sm p-6 sm:p-8 box-glow-neon z-10">
        <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-6 text-xs text-[#8A8A8A]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
            <span className="text-[#39FF14] font-bold tracking-widest uppercase">&gt; ADMIN_TERMINAL</span>
          </div>
          <span className="font-mono text-[#555555]">CCE::DEPT</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-2">
            ADMIN ACCESS
          </h1>
          <p className="text-xs sm:text-sm text-[#8A8A8A]">
            Authorized personnel only.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="adminUsername"
            label="Username"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            required
          />

          <InputField
            id="adminPassword"
            label="Password"
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError(null);
            }}
            required
          />

          {error && (
            <div className="text-xs text-[#FF4D4D] font-mono tracking-tight flex items-center space-x-1">
              <span>&gt;</span>
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 bg-[#39FF14] text-[#080808] font-spaceMonoBold font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              LOGIN
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-[10px] text-[#555555] font-mono border-t border-[#242424] pt-4">
          PROTOTYPE DEMO: Enter any credentials to login as Admin
        </div>
      </div>
    </section>
  );
}
