import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";

/* ── Difficulty badge colors ── */
const DIFFICULTY_STYLES = {
  beginner:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  intermediate:
    "border-amber-500/30 bg-amber-500/10 text-amber-400",
  advanced:
    "border-rose-500/30 bg-rose-500/10 text-rose-400",
};

/* ── Language icon map ── */
const LANG_ICONS = {
  cpp: "⚙️",
  python: "🐍",
  javascript: "🟨",
  typescript: "🔷",
  java: "☕",
  rust: "🦀",
  go: "🐹",
};

/* ── Lock icon SVG ── */
function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted/50"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

/* ── Check icon SVG ── */
function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-correct"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Main LessonList Component ── */
export default function LessonList({ onSelectLesson }) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState([]);
  const [completedLessonIds, setCompletedLessonIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      setError(null);

      // Fetch all lessons ordered by order_index
      const { data: lessonData, error: lessonErr } = await supabase
        .from("lessons")
        .select("*")
        .order("order_index", { ascending: true });

      if (lessonErr) {
        setError("Failed to load lessons.");
        console.error("Lessons fetch error:", lessonErr);
        setLoading(false);
        return;
      }

      // Fetch completed progress rows for the current user
      const { data: progressData, error: progressErr } = await supabase
        .from("progress")
        .select("lesson_id")
        .eq("user_id", user.id);

      if (progressErr) {
        console.error("Progress fetch error:", progressErr);
        // Still show lessons but without completion data
      }

      setLessons(lessonData || []);
      setCompletedLessonIds(
        new Set((progressData || []).map((p) => p.lesson_id))
      );
      setLoading(false);
    }

    fetchData();
  }, [user]);

  /**
   * A lesson is unlocked if:
   * - It's the first lesson (index 0), OR
   * - The previous lesson (by order_index) has a completed progress row
   */
  function isUnlocked(index) {
    if (index === 0) return true;
    const prevLesson = lessons[index - 1];
    return completedLessonIds.has(prevLesson.id);
  }

  function isCompleted(lessonId) {
    return completedLessonIds.has(lessonId);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in-up">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-surface-3 border-t-accent" />
        <p className="text-sm text-muted">Loading lessons…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in-up">
        <p className="text-sm text-incorrect">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-lg border border-border bg-surface-2 px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-gray-300"
        >
          Retry
        </button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 animate-fade-in-up">
        <p className="text-sm text-muted">No lessons available yet.</p>
      </div>
    );
  }

  const completedCount = lessons.filter((l) => isCompleted(l.id)).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Header ── */}
      <header className="mb-10 animate-fade-in-up text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
          <span className="inline-block h-2 w-2 rounded-full bg-correct animate-pulse" />
          Lesson Library
        </div>
        <h1 className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl animate-gradient">
          CodeFlow
        </h1>
        <p className="mt-3 text-sm text-muted">
          Complete each lesson to unlock the next. Build your speed step by step.
        </p>
      </header>

      {/* ── Progress overview ── */}
      <div
        className="mb-8 animate-fade-in-up"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between rounded-xl border border-border bg-surface-1/60 px-5 py-3 backdrop-blur-sm">
          <span className="text-xs text-muted">
            Progress:{" "}
            <span className="font-semibold text-gray-200">
              {completedCount}
            </span>{" "}
            / {lessons.length} lessons
          </span>
          <span className="text-xs font-medium text-accent-bright tabular-nums">
            {lessons.length > 0
              ? Math.round((completedCount / lessons.length) * 100)
              : 0}
            %
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{
              width: `${
                lessons.length > 0
                  ? (completedCount / lessons.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>

      {/* ── Lesson Cards ── */}
      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const unlocked = isUnlocked(index);
          const completed = isCompleted(lesson.id);
          const diffStyle =
            DIFFICULTY_STYLES[lesson.difficulty] || DIFFICULTY_STYLES.beginner;
          const langIcon = LANG_ICONS[lesson.language] || "📄";
          const delay = 150 + index * 60;

          return (
            <button
              key={lesson.id}
              id={`lesson-card-${index}`}
              disabled={!unlocked}
              onClick={() =>
                unlocked &&
                onSelectLesson({
                  id: lesson.id,
                  title: lesson.title,
                  code: lesson.snippet_text,
                  language: lesson.language,
                })
              }
              className={`animate-fade-in-up group relative w-full cursor-pointer rounded-2xl border p-5 text-left transition-all duration-200 ${
                unlocked
                  ? completed
                    ? "border-correct/20 bg-correct/[0.03] hover:border-correct/40 hover:bg-correct/[0.06] hover:shadow-lg hover:shadow-correct/5"
                    : "border-border bg-surface-1/60 hover:border-accent/50 hover:bg-surface-1 hover:shadow-lg hover:shadow-accent/5"
                  : "cursor-not-allowed border-border/50 bg-surface-1/30 opacity-50"
              }`}
              style={{ animationDelay: `${delay}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Lesson number / status icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
                    completed
                      ? "border border-correct/30 bg-correct/10 text-correct"
                      : unlocked
                        ? "border border-accent/30 bg-accent/10 text-accent-bright"
                        : "border border-border bg-surface-2 text-muted/50"
                  }`}
                >
                  {completed ? (
                    <CheckIcon />
                  ) : unlocked ? (
                    index + 1
                  ) : (
                    <LockIcon />
                  )}
                </div>

                {/* Lesson info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3
                      className={`truncate text-sm font-semibold ${
                        unlocked ? "text-gray-200" : "text-muted/60"
                      }`}
                    >
                      {langIcon} {lesson.title}
                    </h3>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${diffStyle}`}
                    >
                      {lesson.difficulty}
                    </span>
                    <span className="text-[10px] text-muted/60 uppercase tracking-wider">
                      {lesson.language}
                    </span>
                  </div>
                </div>

                {/* Arrow / lock indicator */}
                <div className="shrink-0">
                  {unlocked ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent-bright"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  ) : (
                    <LockIcon />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer
        className="mt-16 text-center text-xs text-muted/60 animate-fade-in-up"
        style={{ animationDelay: "600ms" }}
      >
        <p>
          Complete lessons in order to unlock new challenges · Built with React +
          Tailwind
        </p>
      </footer>
    </div>
  );
}
