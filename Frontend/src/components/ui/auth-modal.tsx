"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "signin" | "signup";
  onAuthSuccess?: (email: string) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialMode = "signin",
  onAuthSuccess,
}: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Sync mode when initialMode changes or modal opens
  useEffect(() => {
    setIsSignUp(initialMode === "signup");
    setError(null);
    setSuccessMsg(null);
  }, [initialMode, isOpen]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up API Call -> JSON to POST /api/auth/register
        const response = await fetch("https://roleready-backend-uls8.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Registration failed. Email might already exist.");
        }

        setSuccessMsg("Account created! Logging you in...");

        // After successful registration, automatically log in to fetch JWT Token
        const loginFormData = new URLSearchParams();
        loginFormData.append("username", email);
        loginFormData.append("password", password);

        const loginRes = await fetch("https://roleready-backend-uls8.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: loginFormData,
        });

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.access_token) {
          localStorage.setItem("token", loginData.access_token);
          localStorage.setItem("user_email", email);
          if (onAuthSuccess) onAuthSuccess(email);
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setIsSignUp(false); // Switch to sign in tab if auto-login requires manual click
        }
      } else {
        // Sign In API Call -> Form Data to POST /api/auth/login
        const formData = new URLSearchParams();
        formData.append("username", email);
        formData.append("password", password);

        const response = await fetch("https://roleready-backend-uls8.onrender.com/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Incorrect email or password.");
        }

        if (data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("user_email", email);
          setSuccessMsg("Successfully authenticated!");
          if (onAuthSuccess) onAuthSuccess(email);
          setTimeout(() => {
            onClose();
          }, 800);
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-4xl min-h-[560px] bg-[#0f111a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex z-10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-30 p-2 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Left/Right Sliding Layout */}
            <div className="relative w-full h-full min-h-[560px] flex flex-col md:flex-row overflow-hidden">

              {/* Form Section */}
              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
                <div className="mb-6">
                  <h2 className="text-3xl font-extrabold text-white tracking-tight">
                    {isSignUp ? "Create Account" : "Welcome Back"}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    {isSignUp
                      ? "Start your AI interview preparation in seconds."
                      : "Sign in to access your saved mock interviews & reports."}
                  </p>
                </div>

                {/* Error Banner */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {/* Success Banner */}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{successMsg}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Full Name (optional)"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="password"
                      required
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isSignUp ? (
                      "Create Account"
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                {/* Mobile Toggle Trigger */}
                <div className="mt-6 text-center md:hidden">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-xs text-indigo-400 hover:underline"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "New to RoleReady? Create Account"}
                  </button>
                </div>
              </div>

              {/* Curved Sliding Side Panel */}
              <motion.div
                animate={{
                  x: isSignUp ? "0%" : "100%",
                  borderTopLeftRadius: isSignUp ? "120px" : "0px",
                  borderBottomLeftRadius: isSignUp ? "120px" : "0px",
                  borderTopRightRadius: isSignUp ? "0px" : "120px",
                  borderBottomRightRadius: isSignUp ? "0px" : "120px",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="hidden md:flex absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-12 flex-col justify-center items-center text-center text-white z-20 shadow-2xl"
                style={{
                  left: isSignUp ? "50%" : "0%",
                }}
              >
                <div className="max-w-xs space-y-4">
                  <h3 className="text-3xl font-black tracking-tight">
                    {isSignUp ? "One of us?" : "New to RoleReady?"}
                  </h3>
                  <p className="text-sm text-indigo-100 font-light leading-relaxed">
                    {isSignUp
                      ? "Welcome back! Sign in to continue your interview coaching journey."
                      : "Paste any job description and practice personalized AI mock interviews instantly."}
                  </p>
                  <button
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError(null);
                    }}
                    className="mt-4 px-8 py-3 rounded-full border-2 border-white text-white font-semibold text-sm hover:bg-white hover:text-indigo-900 transition-all shadow-lg"
                  >
                    {isSignUp ? "SIGN IN" : "SIGN UP"}
                  </button>
                </div>
              </motion.div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
