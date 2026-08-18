import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import { api, setToken, setStoredUser } from "../services/api";

export default function RegisterPage({ navigateTo, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await api.auth.register({
        name: formData.fullName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      if (res.token) {
        setToken(res.token);
      }
      if (res.user) {
        setStoredUser(res.user);
      }

      if (onAuthSuccess) {
        onAuthSuccess(res.user);
      }

      setIsSuccess(true);
    } catch (err) {
      setServerError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout heading="ACCOUNT CREATED">
        <div className="text-center py-4 space-y-6">
          <div className="w-12 h-12 rounded-full bg-[#39FF14]/10 border border-[#39FF14] flex items-center justify-center mx-auto text-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.3)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-[#F5F5F5] font-spaceMonoBold leading-relaxed">
            Your account has been created successfully.
          </p>
          <button
            type="button"
            onClick={() => navigateTo("/team")}
            className="w-full py-3 bg-[#39FF14] text-[#080808] font-spaceMonoBold font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all cursor-pointer"
          >
            CONTINUE TO TEAM SETUP
          </button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      heading="CREATE YOUR ACCOUNT"
      description="Create your participant account to join the CCE CTF Competition."
      footerLinkText="Already have an account?"
      footerActionText="LOGIN"
      onFooterActionClick={() => navigateTo("/login")}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D] font-mono">
            &gt; {serverError}
          </div>
        )}

        <InputField
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          error={errors.fullName}
          required
        />

        <InputField
          id="username"
          label="Username"
          placeholder="Choose a username"
          value={formData.username}
          onChange={(e) => handleChange("username", e.target.value)}
          error={errors.username}
          required
        />

        <InputField
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          error={errors.email}
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />

        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          error={errors.confirmPassword}
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#39FF14] text-[#080808] font-spaceMonoBold font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
