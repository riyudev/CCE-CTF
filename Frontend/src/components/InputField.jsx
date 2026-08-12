import React, { useState } from "react";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  const actualType = isPasswordField
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex flex-col space-y-1.5 w-full font-spaceMonoBold">
      <label htmlFor={id} className="text-xs uppercase tracking-wider text-[#8A8A8A]">
        {label} {required && <span className="text-[#39FF14]">*</span>}
      </label>
      <div className="relative flex items-center">
        <input
          id={id}
          type={actualType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full bg-[#080808] text-[#F5F5F5] border text-sm rounded-sm px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#555555] ${
            error
              ? "border-[#FF4D4D] focus:border-[#FF4D4D] focus:ring-1 focus:ring-[#FF4D4D]"
              : "border-[#242424] focus:border-[#39FF14] focus:ring-1 focus:ring-[#39FF14]/30"
          } ${isPasswordField ? "pr-10" : ""}`}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-[#8A8A8A] hover:text-[#39FF14] text-xs font-mono focus:outline-none select-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.038 10.038 0 013.682-.863c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-1.99-1.99a3 3 0 11-4.243-4.243M3 3l18 18" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-[#FF4D4D] font-mono tracking-tight flex items-center space-x-1 mt-0.5">
          <span>&gt;</span>
          <span>{error}</span>
        </span>
      )}
    </div>
  );
}
