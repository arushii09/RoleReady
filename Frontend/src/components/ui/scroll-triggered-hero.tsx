'use client';

import { cn } from "@/lib/utils";
import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronRight, Sparkles } from 'lucide-react';

// --- Types & Data ---
interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  theme: 'light' | 'dark';
  description: string;
}

/* 
=============================================================================
 🖼️ CUSTOMIZE YOUR IMAGES HERE
 You can replace the `imageUrl` fields in the `chapters` array below with your own
 JPG or PNG image links (e.g., hosted locally in /src/images or via Unsplash/CDN).
=============================================================================
*/
const chapters: Chapter[] = [
  {
    id: '01',
    title: 'Analyze Job Description',
    subtitle: 'Paste Any Job Description',
    // 🖼️ IMAGE 1 LOCATION: Replace this URL with your custom JPG image path or link
    imageUrl: 'https://images.unsplash.com/photo-1625838144804-300f3907c110?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    theme: 'dark',
    description: 'Drop in any job posting. RoleReady’s AI extracts core responsibilities, skill requirements, and seniority level to tailor your practice session.',
  },
  {
    id: '02',
    title: 'Live Mock',
    subtitle: 'Answer Role-Specific Questions',
    // 🖼️ IMAGE 2 LOCATION: Replace this URL with your custom JPG image path or link
    imageUrl: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    theme: 'dark',
    description: 'Face 10 realistic technical and behavioral interview questions generated dynamically for your target role and company.',
  },
  {
    id: '03',
    title: 'Immersion',
    subtitle: 'Get Instant Scores & Debrief',
    // 🖼️ IMAGE 3 LOCATION: Replace this URL with your custom JPG image path or link
    imageUrl: 'https://images.unsplash.com/photo-1643962578277-0e7e2f7b7c63?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    theme: 'light',
    description: 'Receive structured 1–10 scores for every response, actionable feedback on weak areas, model answer improvements, and a study plan.',
  },
];

// --- Animation Variants ---
const textContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 }
  }
};

const textReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.4, ease: "easeOut" as const }
  }
};

// --- Sub-Components ---

const FilmGrain = () => (
  <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.07] mix-blend-overlay">
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  </div>
);

const ImageBackground = ({ currentChapterIndex }: { currentChapterIndex: number }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-black">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentChapterIndex ? 1 : 0,
            zIndex: index === currentChapterIndex ? 10 : 0,
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          {/*
            =========================================================================
            🖼️ IMAGE RENDERER
            `src={chapter.imageUrl}` pulls the JPG image link defined in `chapters`.
            =========================================================================
          */}
          <img
            src={chapter.imageUrl}
            alt={chapter.title}
            className="h-full w-full object-cover"
            onError={(e) => {
              const fallbacks = [
                'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80',
                'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1920&q=80',
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80'
              ];
              const target = e.currentTarget;
              target.src = fallbacks[index % fallbacks.length];
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>
      ))}
      <FilmGrain />
    </div>
  );
};

const DynamicNav = ({
  activeIndex,
  progress
}: {
  activeIndex: number,
  progress: any
}) => {
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 p-2 pl-6 pr-2 shadow-2xl"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-white/50">
          Chapter {chapters[activeIndex].id}
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xs font-bold text-white min-w-[100px]"
          >
            {chapters[activeIndex].title}
          </motion.span>
        </AnimatePresence>
      </div>

      <div className="relative h-12 w-12 flex items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform">
          <circle cx="24" cy="24" r="18" className="stroke-white/10" strokeWidth="2" fill="none" />
          <motion.circle
            cx="24" cy="24" r="18"
            className="stroke-indigo-500"
            strokeWidth="2"
            fill="none"
            strokeDasharray="113"
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white">
          <Sparkles size={16} className="text-indigo-400" />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---

export default function CinematicScrol() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(
        Math.floor(latest * chapters.length),
        chapters.length - 1
      );
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <section ref={containerRef} className="relative w-full" style={{ height: `${chapters.length * 100}vh` }}>

      {/* 1. Background */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ImageBackground currentChapterIndex={activeIndex} />
      </div>

      {/* 2. Nav */}
      <DynamicNav activeIndex={activeIndex} progress={scrollYProgress} />

      {/* 3. Content */}
      <div className="absolute inset-0 top-0 z-30 pointer-events-none">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="flex h-screen w-full items-center justify-start px-6 md:px-24"
          >
            <motion.div
              variants={textContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-20%" }}
              className="max-w-4xl pointer-events-auto"
            >
              {/* Header Line */}
              <motion.div variants={fadeIn} className="flex items-center gap-4 mb-6">
                <div className="h-0.5 w-12 bg-indigo-500" />
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">
                  Chapter {chapter.id}
                </span>
              </motion.div>

              {/* Masked Title Reveal */}
              <div className="overflow-hidden mb-6 py-2">
                <motion.h2
                  variants={textReveal}
                  className="text-4xl md:text-7xl font-black text-white tracking-tighter leading-none"
                >
                  {chapter.subtitle}
                </motion.h2>
              </div>

              {/* Description Box */}
              <motion.div
                variants={fadeIn}
                className="max-w-md p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl"
              >
                <p className="text-lg text-white/80 leading-relaxed font-light">
                  {chapter.description}
                </p>
              </motion.div>

              {/* Button */}
              <motion.button
                variants={fadeIn}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 group flex items-center gap-4 text-white font-semibold"
              >
                <div className="relative h-12 w-12 rounded-full border border-white/30 flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <ChevronRight size={20} className="relative z-10 group-hover:text-black transition-colors duration-300" />
                </div>
                <span className="tracking-widest uppercase text-xs">Explore Sequence</span>
              </motion.button>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
