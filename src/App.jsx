import { useState, lazy, Suspense } from "react";
import LessonList from "./components/LessonList";
import TypingPractice from "./components/TypingPractice";
import StatsPage from "./components/StatsPage";
import { useAuth } from "./lib/useAuth";
import { useStreak } from "./lib/useStreak";

/* ── Lazy-load 3D scene (only on login screen) ── */
const KeyboardScene = lazy(() => import("./components/KeyboardScene"));

/* ── GitHub SVG icon (16×16) ── */
function GitHubIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
        0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
        -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87
        2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
        0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65
        7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44
        1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
        3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01
        8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}

/* ── Hero Landing / Login Screen ── */
function LoginScreen({ onLogin }) {
  return (
    <div className="relative min-h-screen bg-surface-0 font-sans overflow-hidden">
      {/* Ambient gradient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/[0.08] blur-[140px]" />
        <div className="absolute -bottom-1/3 right-0 h-[500px] w-[500px] rounded-full bg-violet-600/[0.06] blur-[120px]" />
        <div className="absolute top-1/4 -left-1/4 h-[400px] w-[400px] rounded-full bg-purple-600/[0.04] blur-[100px]" />
      </div>

      {/* 3D Keyboard Canvas (background) */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <KeyboardScene />
        </Suspense>
      </div>

      {/* Gradient overlay to ensure text readability */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-surface-0 via-surface-0/70 to-surface-0/30" />

      {/* Hero content overlay */}
      <div className="relative z-20 flex min-h-screen flex-col items-center justify-end pb-20 px-4 sm:justify-center sm:pb-0">
        <div className="text-center space-y-8 animate-fade-in-up max-w-2xl">
          {/* Tagline pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/50 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-correct animate-pulse" />
            Level up your coding speed
          </div>

          {/* Headline */}
          <div>
            <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl animate-gradient">
              CodeFlow
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base text-gray-400 sm:text-lg">
              Master typing real code — from home row drills to full-stack snippets. Track streaks, speed, and accuracy.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            {["7 progressive stages", "56 curated snippets", "Real-time WPM tracking", "Streak system"].map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-border/60 bg-surface-1/40 px-3 py-1 backdrop-blur-sm"
              >
                {feat}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-3">
            <button
              id="login-github-btn"
              onClick={onLogin}
              className="cursor-pointer inline-flex items-center gap-2.5 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-gray-900 shadow-lg shadow-white/10 transition-all hover:bg-gray-100 hover:shadow-white/25 hover:scale-[1.02] active:scale-[0.97]"
            >
              <GitHubIcon />
              Start practicing
            </button>
            <span className="text-xs text-muted/60">
              Free · Sign in with GitHub to save progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ── Loading Spinner ── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-3 border-t-accent" />
    </div>
  );
}

/* ── Flame SVG icon ── */
function FlameIcon({ className = "" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z"
        fill="url(#flame-grad)"
        stroke="none"
      />
      <path
        d="M12 12c0 2-1.5 3-1.5 4.5a1.5 1.5 0 0 0 3 0c0-1.5-1.5-2.5-1.5-4.5z"
        fill="#fef08a"
        stroke="none"
      />
      <defs>
        <linearGradient id="flame-grad" x1="12" y1="2" x2="12" y2="20" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="1" stopColor="#ef4444" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ── Streak Badge ── */
function StreakBadge({ streak }) {
  const hasStreak = streak > 0;

  return (
    <div
      id="streak-badge"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs font-mono text-white font-bold transition-all"
      title={`Current streak: ${streak} day${streak !== 1 ? "s" : ""}`}
    >
      <FlameIcon className={hasStreak ? "text-amber-500" : "opacity-40"} />
      <span className="tabular-nums">{streak}</span>
    </div>
  );
}

/* ── Top Navigation Bar ── */
function NavBar({ user, onSignOut, currentStreak, onStats, onHome }) {
  const avatarUrl = user.user_metadata?.avatar_url;
  const name =
    user.user_metadata?.user_name ||
    user.user_metadata?.full_name ||
    user.email;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-[#0d0d0f]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo + streak */}
        <div className="flex items-center gap-3">
          <button
            onClick={onHome}
            className="cursor-pointer text-sm font-bold tracking-tight text-white hover:text-gray-300 transition-colors"
          >
            CodeFlow
          </button>
          <StreakBadge streak={currentStreak} />
        </div>

        {/* Nav actions + user info */}
        <div className="flex items-center gap-2.5">
          {/* Stats button */}
          <button
            id="stats-nav-btn"
            onClick={onStats}
            title="View stats"
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="12" width="4" height="9" rx="1" />
              <rect x="10" y="7" width="4" height="14" rx="1" />
              <rect x="17" y="3" width="4" height="18" rx="1" />
            </svg>
            <span className="hidden sm:inline">Stats</span>
          </button>

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={name}
              className="h-6 w-6 rounded-full border border-border"
            />
          )}
          <span className="hidden text-xs font-medium text-gray-300 sm:inline">
            {name}
          </span>
          <button
            id="sign-out-btn"
            onClick={onSignOut}
            className="cursor-pointer rounded-md border border-border bg-surface-1 px-2.5 py-1 text-xs font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}

/* ── App Shell ── */
export default function App() {
  const { user, loading, signInWithGitHub, signOut } = useAuth();
  const [activeLesson, setActiveLesson] = useState(null);
  const [page, setPage] = useState("lessons"); // "lessons" | "stats"
  const { currentStreak, longestStreak } = useStreak(user?.id ?? null);

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen onLogin={signInWithGitHub} />;

  const goHome = () => {
    setActiveLesson(null);
    setPage("lessons");
  };

  return (
    <>
      <NavBar
        user={user}
        onSignOut={signOut}
        currentStreak={currentStreak}
        onHome={goHome}
        onStats={() => { setActiveLesson(null); setPage("stats"); }}
      />
      {/* Push content below the fixed nav */}
      <div className="pt-14">
        {page === "stats" ? (
          <StatsPage
            onBack={goHome}
            streakData={{ currentStreak, longestStreak }}
          />
        ) : activeLesson ? (
          <TypingPractice
            lesson={activeLesson}
            onBack={goHome}
          />
        ) : (
          <LessonList onSelectLesson={setActiveLesson} />
        )}
      </div>
    </>
  );
}
