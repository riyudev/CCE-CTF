import React from "react";

export default function AuthLayout({
  heading,
  description,
  children,
  footerLinkText,
  footerActionText,
  onFooterActionClick,
}) {
  return (
    <section className="relative min-h-[calc(100vh-4rem-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#080808]">
      {/* Subtle cybersecurity visual grid background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      {/* Centered Auth Card */}
      <div className="relative w-full max-w-md bg-[#111111] border border-[#242424] rounded-sm p-6 sm:p-8 shadow-[0_0_25px_rgba(0,0,0,0.8)] z-10 box-glow-neon">
        {/* Top Status Header */}
        <div className="flex items-center justify-between border-b border-[#242424] pb-4 mb-6 text-xs text-[#8A8A8A] font-spaceMonoBold">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#39FF14] shadow-[0_0_6px_#39FF14]" />
            <span className="text-[#39FF14] tracking-widest uppercase">&gt; AUTH_TERMINAL</span>
          </div>
          <span className="font-mono text-[#555555]">CCE::CTF</span>
        </div>

        {/* Heading & Description */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-minecraftBold text-[#F5F5F5] tracking-wide mb-2">
            {heading}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-[#8A8A8A] font-spaceMonoBold leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Form / Content Slot */}
        <div>{children}</div>

        {/* Footer Navigation */}
        {footerActionText && (
          <div className="mt-6 pt-5 border-t border-[#242424] text-center text-xs text-[#8A8A8A] font-spaceMonoBold">
            <span>{footerLinkText} </span>
            <button
              type="button"
              onClick={onFooterActionClick}
              className="text-[#39FF14] hover:underline font-bold tracking-wider uppercase focus:outline-none"
            >
              {footerActionText}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
