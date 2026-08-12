import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import InputField from "./InputField";
import { api, setToken } from "../services/api";

export default function LoginPage({ navigateTo, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username or email is required";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      const res = await api.auth.login({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      if (res.token) {
        setToken(res.token);
      }

      if (onAuthSuccess) {
        onAuthSuccess(res.user);
      }

      if (res.user?.role === "admin") {
        navigateTo("/admin");
      } else if (res.user?.team) {
        navigateTo("/dashboard");
      } else {
        navigateTo("/team");
      }
    } catch (err) {
      setServerError(err.message || "Invalid username or password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      heading="WELCOME BACK"
      description="Log in to access your CTF competition account."
      footerLinkText="Don't have an account?"
      footerActionText="CREATE ACCOUNT"
      onFooterActionClick={() => navigateTo("/register")}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {serverError && (
          <div className="bg-[#FF4D4D]/10 border border-[#FF4D4D] p-3 rounded-sm text-xs text-[#FF4D4D] font-mono">
            &gt; {serverError}
          </div>
        )}

        <InputField
          id="identifier"
          label="Username or Email"
          placeholder="Enter username or email"
          value={formData.identifier}
          onChange={(e) => handleChange("identifier", e.target.value)}
          error={errors.identifier}
          required
        />

        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          error={errors.password}
          required
        />

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-[#39FF14] text-[#080808] font-spaceMonoBold font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-[#39FF14]/90 hover:shadow-[0_0_15px_rgba(57,255,20,0.4)] transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? "LOGGING IN..." : "LOGIN"}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
