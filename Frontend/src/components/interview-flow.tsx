"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Award,
  RotateCcw,
  Send,
  FileText,
  Briefcase,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface Evaluation {
  question: string;
  answer: string;
  score: number;
  feedback: string;
  better_answer: string;
}

interface FinalReport {
  overall_score: number;
  strengths: string[];
  weak_areas: string[];
  study_plan: string[];
  evaluations?: Evaluation[];
}

const TEMPLATES = [
  {
    title: "Full Stack AI Engineer",
    text: "We are seeking a Full Stack AI Engineer proficient in Python, FastAPI, React, TypeScript, and LangChain. Experience with LLM orchestration (Groq, OpenAI), RAG architecture, vector databases, and responsive dark-mode UI engineering is highly desirable."
  },
  {
    title: "Senior Backend Developer",
    text: "Looking for a Senior Backend Developer with expertise in Python, FastAPI/Django, PostgreSQL, Redis caching, async task queues, OAuth2/JWT authentication, Docker containerization, and RESTful API architecture."
  },
  {
    title: "Frontend React Specialist",
    text: "Join our team as a Frontend React Specialist. Required skills: React 19, TypeScript, Tailwind CSS, Framer Motion, Next.js/Vite, state management, and building high-performance modern web applications."
  },
  {
    title: "Data & ML Engineer",
    text: "Seeking a Data & ML Engineer with strong Python experience in Pandas, PyTorch/TensorFlow, model fine-tuning, vector search, data pipelines, SQL, and deploying machine learning microservices into production."
  }
];

interface InterviewFlowProps {
  onBackToDashboard: () => void;
  onOpenAuth: (mode: "signin" | "signup") => void;
}

export function InterviewFlow({ onBackToDashboard, onOpenAuth }: InterviewFlowProps) {
  // Step 1: "jd_input" | Step 2: "session" | Step 3: "report"
  const [step, setStep] = useState<"jd_input" | "session" | "report">("jd_input");

  // Step 1 State
  const [jobDescription, setJobDescription] = useState("");
  const [roleLevel, setRoleLevel] = useState("mid-level");
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);

  // Step 2 State
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [evaluatingAnswer, setEvaluatingAnswer] = useState(false);

  // Step 3 State
  const [report, setReport] = useState<FinalReport | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [historySaved, setHistorySaved] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Word count calculator
  const wordCount = candidateAnswer.trim() ? candidateAnswer.trim().split(/\s+/).length : 0;

  // --- STEP 1: Generate Questions ---
  const handleGenerateQuestions = async () => {
    if (!jobDescription.trim()) {
      setStepError("Please paste a job description or select a template above.");
      return;
    }

    setStepError(null);
    setLoadingQuestions(true);

    try {
      const res = await fetch("http://localhost:8000/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_description: jobDescription }),
      });

      if (!res.ok) {
        throw new Error("Failed to generate questions. Please ensure the backend is running.");
      }

      const data = await res.json();
      let parsedQuestions: string[] = [];

      if (typeof data.questions === "string") {
        parsedQuestions = JSON.parse(data.questions);
      } else if (Array.isArray(data.questions)) {
        parsedQuestions = data.questions;
      }

      if (!parsedQuestions || parsedQuestions.length === 0) {
        throw new Error("No questions returned from AI pipeline.");
      }

      setQuestions(parsedQuestions);
      setCurrentQuestionIndex(0);
      setEvaluations([]);
      setStep("session");
    } catch (err: any) {
      setStepError(err.message || "Failed to generate interview questions.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  // --- STEP 2: Evaluate Answer & Advance ---
  const handleSubmitAnswer = async () => {
    if (!candidateAnswer.trim()) {
      setStepError("Please write your answer before submitting.");
      return;
    }

    setStepError(null);
    setEvaluatingAnswer(true);

    const currentQ = questions[currentQuestionIndex];

    try {
      const res = await fetch("http://localhost:8000/evaluate-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentQ,
          answer: candidateAnswer,
          role_level: roleLevel,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to evaluate answer.");
      }

      const evalData = await res.json();
      const newEvaluation: Evaluation = {
        question: currentQ,
        answer: candidateAnswer,
        score: evalData.score ?? 7,
        feedback: evalData.feedback ?? "Good effort.",
        better_answer: evalData.better_answer ?? "Clear explanation provided.",
      };

      const updatedEvaluations = [...evaluations, newEvaluation];
      setEvaluations(updatedEvaluations);
      setCandidateAnswer("");

      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // All questions completed! Synthesize Final Debrief Report
        await handleGenerateFinalReport(updatedEvaluations);
      }
    } catch (err: any) {
      setStepError(err.message || "Failed to evaluate answer.");
    } finally {
      setEvaluatingAnswer(false);
    }
  };

  // --- STEP 3: Synthesize Final Report & Auto-Save History ---
  const handleGenerateFinalReport = async (finalEvals: Evaluation[]) => {
    setGeneratingReport(true);
    setStep("report");

    try {
      const res = await fetch("http://localhost:8000/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          evaluations: finalEvals,
          job_description: jobDescription,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to synthesize debrief report.");
      }

      const reportData: FinalReport = await res.json();
      reportData.evaluations = finalEvals;
      setReport(reportData);

      // Auto-save history if logged in
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch("http://localhost:8000/api/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              job_description: jobDescription,
              overall_score: reportData.overall_score,
              debrief_report: reportData,
            }),
          });
          setHistorySaved(true);
        } catch (e) {
          console.error("Auto-save history error:", e);
        }
      }
    } catch (err: any) {
      setStepError(err.message || "Failed to generate report.");
    } finally {
      setGeneratingReport(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (score >= 5) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-red-400 border-red-500/30 bg-red-500/10";
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-white pt-24 pb-16 px-4 md:px-8 relative">
      {/* Background ambient glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[70rem] h-[25rem] bg-gradient-to-tr from-purple-900/20 via-indigo-600/15 to-sky-500/20 blur-[9rem] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <button
            onClick={onBackToDashboard}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
          >
            ← Back to Landing Dashboard
          </button>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> AI Mock Interview Session
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: JOB DESCRIPTION INPUT */}
        {/* ========================================================================= */}
        {step === "jd_input" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                Paste Your Target Job Posting
              </h2>
              <p className="text-gray-400 text-sm font-light">
                Our AI analyzes core skills, seniority requirements, and key responsibilities to generate a 10-question mock interview.
              </p>
            </div>

            {/* Template Presets */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-indigo-400" /> Quick Preset Templates:
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setJobDescription(tmpl.text)}
                    className="p-3 rounded-xl bg-white/5 hover:bg-indigo-500/10 border border-white/10 hover:border-indigo-500/40 text-left transition-all text-xs font-medium text-gray-300 hover:text-white"
                  >
                    • {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Description Textarea & Seniority */}
            <div className="p-6 md:p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
              {stepError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{stepError}</span>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-400" /> Job Description Text:
                  </label>
                  <span className="text-xs text-gray-500 font-light">{jobDescription.length} characters</span>
                </div>
                <textarea
                  rows={8}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description or requirements here..."
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light leading-relaxed resize-none"
                />
              </div>

              {/* Seniority Selector */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold shrink-0">
                    Seniority Level:
                  </label>
                  <select
                    value={roleLevel}
                    onChange={(e) => setRoleLevel(e.target.value)}
                    className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 transition-all"
                  >
                    <option value="junior" className="bg-[#0f111a]">Junior (0-2 YOE)</option>
                    <option value="mid-level" className="bg-[#0f111a]">Mid-Level (2-5 YOE)</option>
                    <option value="senior" className="bg-[#0f111a]">Senior (5+ YOE)</option>
                    <option value="lead" className="bg-[#0f111a]">Lead / Staff Engineer</option>
                  </select>
                </div>

                <button
                  onClick={handleGenerateQuestions}
                  disabled={loadingQuestions}
                  className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loadingQuestions ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" /> AI Analyzing JD & Chaining Questions...
                    </>
                  ) : (
                    <>
                      Generate Mock Interview  <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: INTERACTIVE QUESTION SESSION */}
        {/* ========================================================================= */}
        {step === "session" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            {/* Progress Header */}
            <div className="p-6 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" /> Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-gray-400">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            {/* Current Question Card */}
            <div className="p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
              {stepError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{stepError}</span>
                </div>
              )}

              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Technical & Behavioral Prompt
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
                  {questions[currentQuestionIndex]}
                </h3>
              </div>

              {/* Candidate Answer Textarea */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Type your response below:</span>
                  <span className={wordCount < 10 ? "text-amber-400" : "text-emerald-400"}>
                    {wordCount} words
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  placeholder="Explain your approach, technical details, or past experience..."
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-light leading-relaxed resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCandidateAnswer("I don't know the exact implementation for this.")}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Pass / Unsure
                </button>

                <button
                  onClick={handleSubmitAnswer}
                  disabled={evaluatingAnswer || !candidateAnswer.trim()}
                  className="h-12 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {evaluatingAnswer ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> AI Evaluating Answer...
                    </>
                  ) : (
                    <>
                      Submit Answer <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: COMPREHENSIVE DEBRIEF REPORT */}
        {/* ========================================================================= */}
        {step === "report" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {generatingReport ? (
              <div className="text-center py-24 space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mx-auto" />
                <h3 className="text-2xl font-bold text-white">Synthesizing Final Debrief Report...</h3>
                <p className="text-sm text-gray-400 font-light max-w-md mx-auto">
                  Analyzing all 10 responses, calculating overall performance metrics, and building your study plan.
                </p>
              </div>
            ) : report ? (
              <>
                {/* Header & Overall Score Gauge */}
                <div className="p-8 md:p-12 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-3 max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
                      <Award className="h-3.5 w-3.5" /> Mock Interview Evaluation
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                      Interview Performance Debrief
                    </h2>
                    <p className="text-gray-400 text-sm font-light">
                      Detailed breakdown based on AI evaluation of your responses for {roleLevel} criteria.
                    </p>
                    {historySaved && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Saved to your interview history!
                      </span>
                    )}
                  </div>

                  {/* Overall Score Badge */}
                  <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-white/5 border border-white/10 shrink-0 min-w-[180px]">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-1">Overall Score</span>
                    <span className={`text-6xl font-black ${report.overall_score >= 8 ? 'text-emerald-400' : report.overall_score >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                      {report.overall_score.toFixed(1)}
                    </span>
                    <span className="text-xs text-gray-500 font-light mt-1">out of 10.0</span>
                  </div>
                </div>

                {/* Grid: Strengths & Weak Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths Card */}
                  <div className="p-6 md:p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-emerald-500/20 shadow-2xl space-y-4">
                    <h3 className="text-lg font-bold text-emerald-400 flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" /> Demonstrated Strengths
                    </h3>
                    <ul className="space-y-2.5 text-sm text-gray-300 font-light">
                      {report.strengths?.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weak Areas Card */}
                  <div className="p-6 md:p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-amber-500/20 shadow-2xl space-y-4">
                    <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" /> Key Areas for Improvement
                    </h3>
                    <ul className="space-y-2.5 text-sm text-gray-300 font-light">
                      {report.weak_areas?.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Personalized Study Plan Card */}
                <div className="p-6 md:p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-indigo-500/20 shadow-2xl space-y-4">
                  <h3 className="text-lg font-bold text-indigo-400 flex items-center gap-2">
                    <BookOpen className="h-5 w-5" /> Recommended Study Plan
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {report.study_plan?.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-gray-300 font-light flex items-center gap-2">
                        <span className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Question-by-Question Review Breakdown */}
                <div className="p-6 md:p-8 rounded-3xl bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 shadow-2xl space-y-6">
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    Question-by-Question Breakdown
                  </h3>

                  <div className="space-y-4">
                    {report.evaluations?.map((item, idx) => {
                      const isExpanded = expandedQuestion === idx;
                      return (
                        <div key={idx} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                          <button
                            onClick={() => setExpandedQuestion(isExpanded ? null : idx)}
                            className="w-full p-4 md:p-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(item.score)}`}>
                                Score: {item.score}/10
                              </span>
                              <h4 className="text-sm font-semibold text-white line-clamp-1">
                                {idx + 1}. {item.question}
                              </h4>
                            </div>
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                          </button>

                          {isExpanded && (
                            <div className="p-5 border-t border-white/10 space-y-4 bg-black/40 text-xs font-light">
                              <div>
                                <span className="font-semibold text-indigo-400 block mb-1">Your Answer:</span>
                                <p className="text-gray-300 leading-relaxed bg-white/5 p-3 rounded-xl border border-white/10">{item.answer}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-amber-400 block mb-1">AI Feedback & Critique:</span>
                                <p className="text-gray-300 leading-relaxed">{item.feedback}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-emerald-400 block mb-1">Stronger Answer Model:</span>
                                <p className="text-gray-300 leading-relaxed bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">{item.better_answer}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Restart Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      setStep("jd_input");
                      setReport(null);
                      setEvaluations([]);
                    }}
                    className="h-12 px-8 rounded-full bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all flex items-center gap-2 shadow-xl"
                  >
                    <RotateCcw className="h-4 w-4" /> Practice Another Role
                  </button>
                </div>
              </>
            ) : null}
          </motion.div>
        )}

      </div>
    </div>
  );
}
