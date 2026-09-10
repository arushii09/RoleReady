"use client";

import React from "react";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface FooterProps {
  onOpenAuth?: (mode: "signin" | "signup") => void;
}

export function Footer({ onOpenAuth }: FooterProps) {
  return (
    <footer className="relative bg-black text-white overflow-hidden border-t border-white/10 pt-20 pb-12">
      {/* Background ambient glows matching hero theme */}
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] bg-gradient-to-tr from-purple-900/30 via-indigo-600/20 to-sky-500/30 blur-[8rem] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="relative z-10 container mx-auto px-6 lg:px-12">
        {/* Top Newsletter CTA Banner */}
        <div className="mb-16 p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-white/5 via-white/[0.02] to-transparent backdrop-blur-xl shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="h-3.5 w-3.5" /> ACE YOUR NEXT TECH INTERVIEW
            </div>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Ready to test your interview skills?
            </h3>
            <p className="mt-2 text-gray-400 font-light text-base">
              Simulate a full technical mock interview in 5 minutes with real-time AI scoring, structured feedback, and debrief reports.
            </p>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onOpenAuth?.("signup")}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center justify-center gap-2 group shrink-0 shadow-lg shadow-white/10"
            >
              Start Free Mock Interview <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white tracking-tight">RoleReady</span>
            </div>
            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm">
              The end-to-end AI interview coach. Paste any job description to generate tailored questions, live AI evaluation, and actionable debrief reports.
            </p>
            {/* Social Icons with SVG */}
            <div className="pt-2 flex items-center gap-3 text-gray-400">
              {/* GitHub */}
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="GitHub">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="X (Twitter)">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="LinkedIn">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              {/* Discord */}
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors p-2 rounded-full hover:bg-white/10" aria-label="Discord">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2.5 text-sm text-gray-400 font-light">
              <li><a href="#features" className="hover:text-white transition-colors">JD Parser & Skill Extraction</a></li>
              <li><a href="#questions" className="hover:text-white transition-colors">Dynamic Question Chaining</a></li>
              <li><a href="#evaluations" className="hover:text-white transition-colors">Structured AI Evaluation</a></li>
              <li><a href="#debrief" className="hover:text-white transition-colors">Performance Debrief Reports</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2.5 text-sm text-gray-400 font-light">
              <li><a href="#docs" className="hover:text-white transition-colors">GitHub Repository ↗</a></li>
              <li><a href="#api" className="hover:text-white transition-colors">FastAPI API Docs (/docs)</a></li>
              <li><a href="#guides" className="hover:text-white transition-colors">System Architecture Specs</a></li>
              <li><a href="#blog" className="hover:text-white transition-colors">LLM Calibration Research</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & System Status */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-light">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} RoleReady Inc. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-gray-400">All AI pipelines operational (Groq LLaMA 3.3)</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" /> Powered by FastAPI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
