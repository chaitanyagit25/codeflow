import { useState } from "react";
import LessonList from "./components/LessonList";
import TypingPractice from "./components/TypingPractice";
import { useAuth } from "./lib/useAuth";

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

/* ── Login Screen ── */
function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-surface-0 font-sans flex items-center justify-center">
      {/* Ambient gradient background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute -bottom-1/3 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.05] blur-[100px]" />
      </div>

      <div className="relative text-center space-y-8 animate-fade-in-up">
        <div>
          <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl animate-gradient">
            CodeFlow
          </h1>
          <p className="mt-3 text-sm text-muted">
            Sign in to start practicing and track your progress.
          </p>
        </div>

        <button
          id="login-github-btn"
          onClick={onLogin}
          className="cursor-pointer inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-lg shadow-white/10 transition-all hover:bg-gray-100 hover:shadow-white/20 active:scale-[0.97]"
        >
          <GitHubIcon />
          Sign in with GitHub
        </button>
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

/* ── Top Navigation Bar ── */
function NavBar({ user, onSignOut }) {
  const avatarUrl = user.user_metadata?.avatar_url;
  const name =
    user.user_metadata?.user_name ||
    user.user_metadata?.full_name ||
    user.email;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface-0/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Logo */}
        <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
          CodeFlow
        </span>

        {/* User info + sign out */}
        <div className="flex items-center gap-3">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={name}
              className="h-7 w-7 rounded-full border border-border"
            />
          )}
          <span className="hidden text-sm text-gray-300 sm:inline">
            {name}
          </span>
          <button
            id="sign-out-btn"
            onClick={onSignOut}
            className="cursor-pointer rounded-md border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-gray-300"
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

  if (loading) return <LoadingScreen />;
  if (!user) return <LoginScreen onLogin={signInWithGitHub} />;

  return (
    <>
      <NavBar user={user} onSignOut={signOut} />
      {/* Push content below the fixed nav */}
      <div className="pt-14">
        {activeLesson ? (
          <TypingPractice
            lesson={activeLesson}
            onBack={() => setActiveLesson(null)}
          />
        ) : (
          <LessonList onSelectLesson={setActiveLesson} />
        )}
      </div>
    </>
  );
}
