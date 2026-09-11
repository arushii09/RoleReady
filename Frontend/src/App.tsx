import { useState } from "react";
import { Hero2 } from "@/components/ui/hero-2-1";
import { InterviewFlow } from "@/components/interview-flow";
import { HistoryDrawer } from "@/components/history-drawer";

function App() {
  const [view, setView] = useState<"dashboard" | "interview">("dashboard");
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-indigo-500 selection:text-white">
      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
      />

      {/* Views */}
      {view === "dashboard" ? (
        <Hero2
          onStartInterview={() => setView("interview")}
          onOpenHistory={() => setHistoryOpen(true)}
        />
      ) : (
        <InterviewFlow
          onBackToDashboard={() => setView("dashboard")}
          onOpenAuth={() => {}}
        />
      )}
    </main>
  );
}

export default App;
