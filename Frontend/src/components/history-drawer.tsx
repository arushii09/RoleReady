"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Award, ChevronRight, Loader2, Sparkles, BookOpen, AlertTriangle, CheckCircle } from "lucide-react";

interface HistoryItem {
  id: number;
  job_description: string;
  overall_score: number;
  debrief_report: {
    overall_score?: number;
    strengths?: string[];
    weak_areas?: string[];
    study_plan?: string[];
    question_breakdown?: Array<{
      question: string;
      answer: string;
      score: number;
      feedback: string;
      better_answer: string;
    }>;
  };
  created_at: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HistoryDrawer({ isOpen, onClose }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<HistoryItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view your interview history.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://roleready-backend-uls8.onrender.com/api/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch interview history.");
      }

      const data = await res.json();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || "Failed to load past interviews.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreBadge = (score: number) => {
    if (score >= 8) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (score >= 5) {
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    }
    return "bg-red-500/10 text-red-400 border-red-500/30";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Sliding Side Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-xl bg-[#0d0e15] border-l border-white/10 h-full overflow-y-auto p-6 md:p-8 flex flex-col justify-between shadow-2xl"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <Award className="h-4 w-4" />
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight">My Past Interviews</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* History Content */}
              <div className="mt-6 space-y-4">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                    <p className="text-sm font-light">Loading your saved interview debriefs...</p>
                  </div>
                ) : error ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-16 px-4 space-y-3">
                    <Sparkles className="h-10 w-10 text-indigo-400 mx-auto opacity-50" />
                    <h3 className="text-lg font-semibold text-white">No Interview History Yet</h3>
                    <p className="text-sm text-gray-400 font-light max-w-sm mx-auto">
                      Complete your first AI mock interview to generate a debrief report and track your progress over time!
                    </p>
                  </div>
                ) : (
                  history.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => setSelectedReport(item)}
                      className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/40 cursor-pointer transition-all space-y-3 group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadge(item.overall_score)}`}>
                          Score: {item.overall_score.toFixed(1)} / 10
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 line-clamp-2 font-light">
                        {item.job_description}
                      </p>

                      <div className="flex items-center justify-end text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
                        View Full Debrief <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Full Report Details Modal */}
          {selectedReport && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedReport(null)} />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative z-10 w-full max-w-3xl max-h-[90vh] bg-[#0f111a] border border-white/15 rounded-3xl p-6 md:p-8 overflow-y-auto shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreBadge(selectedReport.overall_score)}`}>
                      Overall Score: {selectedReport.overall_score.toFixed(1)} / 10
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2">Historical Debrief Report</h3>
                  </div>
                  <button
                    onClick={() => setSelectedReport(null)}
                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Job Snippet */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-400">
                  <span className="font-semibold text-white block mb-1">Target Job Description:</span>
                  <p className="font-light line-clamp-3">{selectedReport.job_description}</p>
                </div>

                {/* Report Sections */}
                {selectedReport.debrief_report?.strengths && (
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" /> Demonstrated Strengths
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 font-light">
                      {selectedReport.debrief_report.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedReport.debrief_report?.weak_areas && (
                  <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" /> Areas for Improvement
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 font-light">
                      {selectedReport.debrief_report.weak_areas.map((area, idx) => (
                        <li key={idx}>{area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedReport.debrief_report?.study_plan && (
                  <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
                    <h4 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" /> Personalized Study Plan
                    </h4>
                    <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 font-light">
                      {selectedReport.debrief_report.study_plan.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
}
