import React from "react";

export default function Footer() {
  return (
    <footer className="font-spaceMonoBold w-full border-t border-[#242424] bg-[#080808] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-xs text-[#8A8A8A] sm:flex-row">
        <div className="flex items-center space-x-2">
          <span className="text-[#39FF14]">&gt;</span>
          <span>CCE CTF Competition &copy; 2026</span>
        </div>

        <div className="text-center sm:text-right">
          <span>
            Organized by:{" "}
            <strong className="font-normal text-[#F5F5F5]">Yuriiiqt</strong>
          </span>
        </div>
      </div>
    </footer>
  );
}
