"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Menu, X, User, LogOut, Award, History } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import CinematicScrol from "@/components/ui/scroll-triggered-hero";
import { Footer } from "@/components/ui/footer";
import { AuthModal } from "@/components/ui/auth-modal";

interface Hero2Props {
  onStartInterview?: () => void;
  onOpenHistory?: () => void;
}

const Hero2 = ({ onStartInterview, onOpenHistory }: Hero2Props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check auth state on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("user_email");
    const token = localStorage.getItem("token");
    if (storedEmail && token) {
      setUserEmail(storedEmail);
    }
  }, []);

  const openAuth = (mode: "signin" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_email");
    setUserEmail(null);
  };

  const handleAuthSuccess = (email: string) => {
    setUserEmail(email);
  };

  return (
    <div className="relative min-h-screen overflow-x-clip bg-black">
      {/* Auth Modal Component */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Gradient background with grain effect */}
      <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0 ">
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-purple-600 to-sky-600"></div>
        <div className="h-[10rem] rounded-full w-[90rem] z-1 bg-gradient-to-b blur-[6rem] from-pink-900 to-yellow-400"></div>
        <div className="h-[10rem] rounded-full w-[60rem] z-1 bg-gradient-to-b blur-[6rem] from-yellow-600 to-sky-500"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-noise opacity-30"></div>

      {/* Content container */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto flex items-center justify-between px-4 py-4 mt-6">
          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
              <span className="font-bold">🗒</span>
            </div>
            <span className="ml-2 text-xl font-bold text-white">RoleReady</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">

            <div className="flex items-center space-x-3">
              {userEmail ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenHistory}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold transition-colors"
                  >
                    <History className="h-3.5 w-3.5" /> My History
                  </button>

                  <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                    <User className="h-4 w-4 text-indigo-400" />
                    <span className="text-sm font-medium text-white max-w-[140px] truncate">{userEmail}</span>
                    <button
                      onClick={handleLogout}
                      title="Log out"
                      className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => openAuth("signin")}
                  className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90 transition-colors shadow-lg"
                >
                  Login
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu with animation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex flex-col p-4 bg-black/95 md:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                    <span className="font-bold">🗒</span>
                  </div>
                  <span className="ml-2 text-xl font-bold text-white">
                    RoleReady
                  </span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="mt-8 flex flex-col space-y-6">


                {userEmail ? (
                  <div className="pt-4 space-y-3">
                    <div className="text-sm text-gray-300">Logged in as <span className="font-semibold text-white">{userEmail}</span></div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenHistory?.();
                      }}
                      className="w-full justify-center bg-indigo-600/30 border border-indigo-500/50 py-3 rounded-lg text-white font-medium flex items-center gap-2"
                    >
                      <History className="h-4 w-4" /> My Past Interviews
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full justify-center border border-gray-700 py-3 rounded-lg text-white font-medium flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="pt-4">
                      <button
                        onClick={() => openAuth("signin")}
                        className="w-full justify-center border border-gray-700 py-3 rounded-lg text-white font-medium"
                      >
                        Log in
                      </button>
                    </div>
                    <button
                      onClick={() => openAuth("signup")}
                      className="h-12 rounded-full bg-white px-8 text-base font-medium text-black hover:bg-white/90 transition-colors"
                    >
                      Get Started For Free
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Badge */}
        <div className="mx-auto mt-6 flex max-w-fit items-center justify-center space-x-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
          <span className="text-sm font-medium text-white">
            AI-Powered Technical Interview Coach
          </span>
          <ArrowRight className="h-4 w-4 text-white" />
        </div>

        {/* Hero section */}
        <div className="container mx-auto mt-12 px-4 text-center">
          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
            Ace Your Next Tech Interview Before You Walk In
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Paste any Job Description. Experience a realistic 4-step AI mock interview with instant scoring, feedback, and debrief reports.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <button
              onClick={onStartInterview}
              className="h-12 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 text-base font-semibold transition-all shadow-xl shadow-indigo-500/25 flex items-center gap-2"
            >
              Simulate Your Interview
            </button>
          </div>
        </div>

        {/* Scroll-triggered hero section */}
        <div className="mt-16 w-full">
          <CinematicScrol />
        </div>

        {/* Footer Section */}
        <Footer onOpenAuth={openAuth} />
      </div>
    </div>
  );
};

function NavItem({
  label,
  hasDropdown,
}: {
  label: string;
  hasDropdown?: boolean;
}) {
  return (
    <div className="flex items-center text-sm text-gray-300 hover:text-white cursor-pointer">
      <span>{label}</span>
      {hasDropdown && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      )}
    </div>
  );
}

function MobileNavItem({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-gray-800 pb-2 text-lg text-white cursor-pointer">
      <span>{label}</span>
      <ArrowRight className="h-4 w-4 text-gray-400" />
    </div>
  );
}

export { Hero2 };
