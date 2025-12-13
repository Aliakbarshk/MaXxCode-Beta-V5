import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { ArrowLeft, BrainCircuit, CheckCircle, LockOpen } from "lucide-react";
import { clsx } from "clsx";

// Components
import { FloatingBackground } from "./components/layout/FloatingBackground";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { MobileNav } from "./components/layout/MobileNav";
import { DashboardView } from "./components/views/DashboardView";
import { LessonView } from "./components/views/LessonView";
import { ProfileView } from "./components/views/ProfileView";
import { SettingsView } from "./components/views/SettingsView";
import { PlaygroundView } from "./components/views/PlaygroundView";
import { ArcadeView } from "./components/ArcadeGames";
import {
  LeaderboardView,
  CheatsheetView,
  Modal,
  Button,
  MaxAvatar,
  Console,
  Card,
} from "./components/UIComponents";
import { AIChat } from "./components/AIChat";

// Data & Utils
import { LESSONS, BADGES, TRANSLATIONS, THEMES, PROBLEMS } from "./constants";
import { UserState, Language, Badge } from "./types";
import {
  getUserState,
  saveUserState,
  updateStreak,
  checkBadges,
} from "./utils/storage";
import { playSound } from "./utils/audio";

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<
    | "dashboard"
    | "lesson"
    | "profile"
    | "settings"
    | "problems"
    | "problem_solve"
    | "playground"
    | "arcade"
    | "leaderboard"
    | "resources"
  >("dashboard");

  // User State - Initialize from storage
  const [user, setUser] = useState<UserState>(getUserState());

  // Persist the active language selection
  const [activeLanguage, setActiveLanguage] = useState<Language>(
    user.lastActiveLanguage || "python"
  );

  // Admin/Developer & UI State
  const [logoClicks, setLogoClicks] = useState(0);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");

  // Lesson/Problem State
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [currentProblemId, setCurrentProblemId] = useState<string | null>(null);

  // Problems View Logic (Kept here or moved to its own component - let's inline for list, complex view for solve)
  const [code, setCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [lessonFeedback, setLessonFeedback] = useState<
    "none" | "success" | "error"
  >("none");
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showMobileConsole, setShowMobileConsole] = useState(false);

  // Derived Values
  const t = TRANSLATIONS[user.settings.appLanguage];
  const theme = THEMES[user.settings.theme];
  const activeLessons = LESSONS.filter(
    (l) => l.language === activeLanguage
  ).sort((a, b) => a.order - b.order);
  const activeProblems = PROBLEMS.filter((p) => p.language === activeLanguage);

  // Initialize
  useEffect(() => {
    const updatedUser = updateStreak(getUserState());
    setUser(updatedUser);
    saveUserState(updatedUser);
  }, []);

  // Update CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", theme.primary);
    root.style.setProperty("--color-secondary", theme.secondary);
    root.style.setProperty("--color-accent", theme.accent);
    root.style.setProperty("--color-bg", theme.bg);
    root.style.setProperty("--color-card", theme.card);
    root.style.setProperty("--color-text", theme.text);
    root.style.setProperty("--color-sidebar", theme.sidebar);
  }, [theme]);

  // --- HANDLERS ---

  const handleUpdateUser = (updates: Partial<UserState>) => {
    const newState = { ...user, ...updates };
    setUser(newState);
    saveUserState(newState);
  };

  const handleSetLanguage = (lang: Language) => {
    setActiveLanguage(lang);
    // Persist language choice
    handleUpdateUser({ lastActiveLanguage: lang });
  };

  const handleLogoClick = () => {
    const newClicks = logoClicks + 1;
    setLogoClicks(newClicks);
    if (newClicks === 3) {
      setLogoClicks(0);
      setShowAdminModal(true);
    }
  };

  const verifyAdmin = () => {
    if (adminPassword === "hc1") {
      handleUpdateUser({ adminUnlocked: true });
      playSound("success");
      setShowAdminModal(false);
    } else {
      playSound("error");
      alert("Incorrect Password");
    }
    setAdminPassword("");
  };

  const startLesson = (lessonId: string) => {
    const lesson = LESSONS.find((l) => l.id === lessonId);
    if (lesson) {
      playSound("click");
      setCurrentLessonId(lessonId);
      setCurrentProblemId(null);
      setView("lesson");
    }
  };

  const completeLesson = (xpGain: number = 25, showModal: boolean = true) => {
    if (currentLessonId) {
      const newCompleted = [
        ...new Set([...user.completedLessons, currentLessonId]),
      ];

      // Construct the new state candidate
      let newState = {
        ...user,
        completedLessons: newCompleted,
        xp: user.xp + xpGain,
      };

      // Check for badges using the new candidate state
      const newBadgeIds = checkBadges(newState);
      if (newBadgeIds.length > 0) {
        newState.badges = [...newState.badges, ...newBadgeIds];
        playSound("success"); // Badge earn sound
      }

      // Save everything atomically
      handleUpdateUser(newState);

      if (showModal) setShowCompletionModal(true);
    }
  };

  const nextLesson = () => {
    if (currentLessonId) {
      const currentIndex = activeLessons.findIndex(
        (l) => l.id === currentLessonId
      );
      if (currentIndex >= 0 && currentIndex < activeLessons.length - 1) {
        exitLesson();
        setTimeout(() => {
          startLesson(activeLessons[currentIndex + 1].id);
        }, 100);
      } else {
        exitLesson();
      }
    } else {
      exitLesson();
    }
  };

  const exitLesson = () => {
    setView(currentProblemId ? "problems" : "dashboard");
    setCurrentLessonId(null);
    setCurrentProblemId(null);
    setShowCompletionModal(false);
    playSound("click");
    window.speechSynthesis.cancel();
  };

  // --- PROBLEM SOLVING HANDLERS ---
  const startProblem = (problemId: string) => {
    const problem = PROBLEMS.find((p) => p.id === problemId);
    if (problem) {
      playSound("click");
      setCurrentProblemId(problemId);
      setCurrentLessonId(null);
      setCode(problem.initialCode || "");
      setConsoleOutput([]);
      setLessonFeedback("none");
      setShowMobileConsole(false);
      setView("problem_solve");
    }
  };

  const handleRunProblemCode = () => {
    playSound("click");
    setConsoleOutput([]);
    const outputLines: string[] = [];
    const originalLog = console.log;

    try {
      // Override console.log to capture output
      console.log = (...args) => {
        const formatted = args
          .map((a) => (Array.isArray(a) ? a.toString() : String(a)))
          .join(" ");
        outputLines.push(formatted);
      };

      if (activeLanguage === "javascript") {
        // eslint-disable-next-line no-eval
        eval(code);
      } else {
        // Basic Python Transpilation for Demo
        let jsCode = code
          .replace(/#.*/g, "") // remove comments
          .replace(/print\((.*)\)/g, "console.log($1)") // print -> console.log
          .replace(/([a-z_][a-z0-9_]*)\s*=\s*(.+)/gi, "var $1 = $2"); // basic assignment

        // eslint-disable-next-line no-eval
        eval(`{ ${jsCode} }`);
      }
    } catch (e: any) {
      outputLines.push(`Error: ${e.message}`);
      playSound("error");
    } finally {
      console.log = originalLog; // Restore console.log
      setConsoleOutput([...outputLines]); // Update state
      if (window.innerWidth < 768) setShowMobileConsole(true);
    }
  };

  const checkProblemCode = () => {
    setLessonFeedback("success");
    playSound("success");
  };

  const completeProblem = () => {
    if (currentProblemId) {
      const xpGain = 40;
      const newCompleted = [
        ...new Set([...(user.completedProblems || []), currentProblemId]),
      ];
      handleUpdateUser({
        completedProblems: newCompleted,
        xp: user.xp + xpGain,
      });
      setShowCompletionModal(true);
    }
  };

  // --- RENDER HELPERS ---

  const renderProblemSolveView = () => {
    const problem = currentProblemId
      ? PROBLEMS.find((p) => p.id === currentProblemId)
      : null;
    if (!problem) return null;

    return (
      <div
        className="h-[100dvh] flex flex-col md:flex-row overflow-hidden relative"
        style={{ backgroundColor: theme.bg }}
      >
        <div
          className="w-full md:w-1/4 p-6 md:p-8 overflow-y-auto border-r border-black/5 flex flex-col gap-6"
          style={{ backgroundColor: theme.card, color: theme.text }}
        >
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={exitLesson}
              className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-400" />
            </button>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">
              Practice
            </div>
          </div>
          <h1 className="text-2xl font-black text-[var(--color-primary)]">
            {problem.title}
          </h1>
          <p className="opacity-80 leading-relaxed font-medium">
            {problem.description}
          </p>
          <Card
            theme={user.settings.theme}
            className="!p-5 border-l-4 !border-l-[var(--color-secondary)]"
          >
            <h3 className="font-bold mb-2 text-[var(--color-secondary)]">
              Instructions
            </h3>
            <p className="opacity-90 font-medium">{problem.instructions}</p>
          </Card>
        </div>

        <div className="flex-1 flex flex-col relative border-r border-black/5">
          <textarea
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setLessonFeedback("none");
            }}
            className="flex-1 w-full bg-[#1E1E1E] text-[#D4D4D4] p-6 font-mono text-base resize-none focus:outline-none custom-scrollbar"
            spellCheck={false}
          />
          <div className="hidden md:flex p-4 bg-[#1E1E1E] border-t border-[#333] items-center justify-end gap-3 shadow-[0_-5px_15px_rgba(0,0,0,0.3)] z-10">
            <Button variant="secondary" onClick={handleRunProblemCode}>
              Run
            </Button>
            <Button variant="primary" onClick={checkProblemCode}>
              Check
            </Button>
          </div>
        </div>

        <div className="hidden md:flex w-1/4 flex-col bg-[#1E1E1E] border-l border-[#333]">
          <div className="flex-1 p-4 overflow-hidden">
            <Console output={consoleOutput} theme={user.settings.theme} />
          </div>
        </div>

        <div className="md:hidden bg-white p-3 border-t border-gray-200 flex gap-2 z-10 pb-safe">
          <Button variant="secondary" fullWidth onClick={handleRunProblemCode}>
            Run
          </Button>
          <Button variant="primary" fullWidth onClick={checkProblemCode}>
            Check
          </Button>
        </div>

        {/* Feedback Toast */}
        <div
          className={clsx(
            "fixed bottom-20 md:bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-96 p-4 transition-all duration-300 z-50",
            lessonFeedback === "none"
              ? "translate-y-[150%] opacity-0"
              : "translate-y-0 opacity-100"
          )}
        >
          <div
            className={clsx(
              "rounded-2xl p-4 shadow-2xl flex items-center justify-between border-l-8 backdrop-blur-md animate-pop",
              lessonFeedback === "success"
                ? "bg-green-50/95 border-green-500 text-green-800"
                : "bg-red-50/95 border-red-500 text-red-800"
            )}
          >
            <span className="font-bold">
              {lessonFeedback === "success" ? "Solved!" : "Error"}
            </span>
            {lessonFeedback === "success" && (
              <Button onClick={completeProblem} variant="success" size="sm">
                Finish
              </Button>
            )}
          </div>
        </div>

        <AIChat
          currentCode={code}
          lessonContext={`Problem: ${problem.title}`}
          appLanguage={user.settings.appLanguage}
          apiKey={user.apiKey}
          isDevMode={user.adminUnlocked}
          onUnlockDevMode={() => handleUpdateUser({ adminUnlocked: true })}
          onSetApiKey={(k) => handleUpdateUser({ apiKey: k })}
        />

        <Modal
          isOpen={showCompletionModal}
          onClose={exitLesson}
          title="Solved!"
          type="success"
        >
          <div className="text-center">
            <MaxAvatar mood="excited" />
            <h3 className="text-2xl font-black mt-4">Great Job!</h3>
            <Button fullWidth onClick={exitLesson} className="mt-4">
              Back
            </Button>
          </div>
        </Modal>
      </div>
    );
  };

  const renderProblemsList = () => (
    <div
      className="min-h-screen flex flex-col md:flex-row"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="flex-1 p-6 md:p-12 overflow-y-auto pb-24">
        <h1 className="text-3xl font-black mb-8 flex items-center gap-3">
          <BrainCircuit size={32} className="text-[var(--color-primary)]" />{" "}
          {t.problems}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeProblems.map((problem) => {
            const isCompleted = user.completedProblems.includes(problem.id);
            return (
              <button
                key={problem.id}
                onClick={() => startProblem(problem.id)}
                className={clsx(
                  "text-left p-6 rounded-3xl border-2 transition-all hover:shadow-xl hover:-translate-y-1",
                  isCompleted
                    ? "bg-white border-green-200 opacity-60"
                    : "bg-white border-gray-200"
                )}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="px-2 py-1 rounded text-xs font-bold uppercase bg-gray-100">
                    {problem.difficulty}
                  </div>
                  {isCompleted && (
                    <CheckCircle size={20} className="text-green-500" />
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                <p className="text-gray-500 text-sm">{problem.description}</p>
              </button>
            );
          })}
        </div>
      </div>
      <MobileNav
        view={view}
        setView={setView}
        t={t}
        theme={user.settings.theme}
      />
    </div>
  );

  return (
    <>
      {/* Views that take over the full screen */}
      {view === "lesson" && currentLessonId && (
        <LessonView
          lesson={LESSONS.find((l) => l.id === currentLessonId)!}
          user={user}
          theme={user.settings.theme}
          t={t}
          activeLanguage={activeLanguage}
          onExit={exitLesson}
          onComplete={completeLesson}
          onNextLesson={nextLesson}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {view === "problem_solve" && renderProblemSolveView()}

      {view === "arcade" && <ArcadeView onBack={() => setView("dashboard")} />}

      {view === "playground" && (
        <PlaygroundView
          user={user}
          theme={user.settings.theme}
          t={t}
          activeLanguage={activeLanguage}
          setActiveLanguage={handleSetLanguage} // Use the persisting handler
          onExit={() => setView("dashboard")}
          onUpdateUser={handleUpdateUser}
        />
      )}

      {/* Main Layout Views */}
      {[
        "dashboard",
        "profile",
        "settings",
        "leaderboard",
        "resources",
        "problems",
      ].includes(view) && (
        <div
          className="flex flex-col md:flex-row h-[100dvh]"
          style={{ backgroundColor: theme.bg, color: theme.text }}
        >
          <Sidebar
            view={view}
            setView={setView}
            t={t}
            theme={user.settings.theme}
            onLogoClick={handleLogoClick}
          />

          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <FloatingBackground />
            <TopBar
              user={user}
              t={t}
              theme={user.settings.theme}
              activeLanguage={activeLanguage}
              setActiveLanguage={handleSetLanguage} // Use the persisting handler
              onLogoClick={handleLogoClick}
              onUnlockClick={() => setShowUnlockModal(true)}
            />

            {view === "dashboard" && (
              <DashboardView
                lessons={activeLessons}
                user={user}
                theme={user.settings.theme}
                onStartLesson={startLesson}
              />
            )}
            {view === "profile" && (
              <ProfileView user={user} theme={user.settings.theme} t={t} />
            )}
            {view === "settings" && (
              <SettingsView
                user={user}
                theme={user.settings.theme}
                t={t}
                onUpdateSetting={(k, v) =>
                  handleUpdateUser({ settings: { ...user.settings, [k]: v } })
                }
                onUpdateApiKey={(k) => handleUpdateUser({ apiKey: k })}
              />
            )}
            {view === "leaderboard" && (
              <div className="flex-1 overflow-y-auto pb-24">
                <div className="p-6">
                  <LeaderboardView theme={user.settings.theme} />
                </div>
              </div>
            )}
            {view === "resources" && (
              <div className="flex-1 overflow-y-auto pb-24">
                <CheatsheetView theme={user.settings.theme} />
              </div>
            )}
            {view === "problems" && renderProblemsList()}

            <MobileNav
              view={view}
              setView={setView}
              t={t}
              theme={user.settings.theme}
            />
          </div>
        </div>
      )}

      {/* Global Modals */}
      <Modal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        title="Developer Mode"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Enter password to unlock full access.
          </p>
          <input
            type="password"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
          />
          <Button fullWidth onClick={verifyAdmin}>
            Unlock Everything
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showUnlockModal}
        onClose={() => setShowUnlockModal(false)}
        title={t.unlockAll}
      >
        <div className="space-y-6 text-center">
          <div className="bg-yellow-50 p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto text-yellow-500 shadow-inner">
            <LockOpen size={48} />
          </div>
          <p className="text-gray-600 leading-relaxed font-medium">
            {t.unlockMsg}
          </p>
          <div className="flex gap-3">
            <Button
              fullWidth
              variant="outline"
              onClick={() => setShowUnlockModal(false)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="primary"
              onClick={() => {
                handleUpdateUser({ adminUnlocked: true });
                setShowUnlockModal(false);
                playSound("success");
              }}
            >
              {t.confirmUnlock}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
