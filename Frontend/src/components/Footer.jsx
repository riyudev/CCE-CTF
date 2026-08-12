import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#080808] border-t border-[#242424] py-8 px-4 sm:px-6 lg:px-8 font-spaceMonoBold">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8A8A8A]">
        <div className="flex items-center space-x-2">
          <span className="text-[#39FF14]">&gt;</span>
          <span>CCE CTF Competition &copy; 2026</span>
        </div>

        <div className="text-center sm:text-right">
          <span>Organized by the <strong className="text-[#F5F5F5] font-normal">CCE Department</strong></span>
        </div>
      </div>
    </footer>
  );
}
