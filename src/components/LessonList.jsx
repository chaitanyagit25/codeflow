import { useState, useEffect, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";

/* ── Stage metadata ── */
const STAGE_INFO = {
  1: { title: "Home Row", desc: "Master the home position — asdf jkl;" },
  2: { title: "Top Row", desc: "Add the top row — qwerty uiop" },
  3: { title: "Bottom Row", desc: "Add the bottom row — zxcv nm,." },
  4: { title: "Numbers", desc: "The number row — 1234567890" },
  5: { title: "Symbols", desc: "Common dev symbols — (){}[]=><" },
  6: { title: "Short Code", desc: "Simple functions in JS & Python" },
  7: { title: "Full Code", desc: "Real-world code snippets" },
};

/* ── Difficulty Pill Styling ── */
const DIFFICULTY_STYLES = {
  beginner: "bg-[#14291f] text-[#3ecf8e] border border-[#3ecf8e]/30",
  intermediate: "bg-[#292214] text-[#f59e0b] border border-[#f59e0b]/30",
  advanced: "bg-[#291717] text-[#f87171] border border-[#f87171]/30",
};

/* ── Language icon components ── */
function DrillIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block text-gray-300">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h4" /><path d="M14 8h4" /><path d="M6 12h2" /><path d="M10 12h8" /><path d="M6 16h12" />
    </svg>
  );
}

function JsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block text-gray-300">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <text x="7" y="17" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">JS</text>
    </svg>
  );
}

function PyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block text-gray-300">
      <path d="M12 2C8 2 6 4 6 6v3h6v1H5c-2 0-3 2-3 4s1 4 3 4h2v-3c0-2 1-3 3-3h6c2 0 3-1 3-3V6c0-2-2-4-6-4z" />
      <circle cx="10" cy="5.5" r="1" fill="currentColor" stroke="none" />
      <path d="M12 22c4 0 6-2 6-4v-3h-6v-1h7c2 0 3-2 3-4s-1-4-3-4h-2v3c0 2-1 3-3 3h-6c-2 0-3 1-3 3v4c0 2 2 4 6 4z" />
      <circle cx="14" cy="18.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CppIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block text-gray-300">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <text x="3" y="17" fontSize="10" fontWeight="bold" fontFamily="monospace" fill="currentColor">C++</text>
    </svg>
  );
}

function TsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="inline-block text-gray-300">
      <rect x="2" y="2" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <text x="7" y="17" fontSize="11" fontWeight="bold" fontFamily="monospace" fill="currentColor">TS</text>
    </svg>
  );
}

function DefaultLangIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block text-gray-300">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

const LANG_ICONS = {
  drill: DrillIcon,
  cpp: CppIcon,
  python: PyIcon,
  javascript: JsIcon,
  typescript: TsIcon,
  java: JsIcon,
  rust: DefaultLangIcon,
  go: DefaultLangIcon,
};

/* ── Lock icon SVG ── */
function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-500"
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
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[#3ecf8e]"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ── Stage Section Header ── */
function StageHeader({ stageNum, completedCount, totalCount, isLocked }) {
  const info = STAGE_INFO[stageNum] || { title: `Stage ${stageNum}`, desc: "" };
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const isComplete = completedCount === totalCount && totalCount > 0;

  return (
    <div
      className={`rounded-lg border px-4 py-3.5 transition-all ${
        isLocked
          ? "border-border bg-surface-1/40 opacity-60"
          : isComplete
            ? "border-[#3ecf8e]/30 bg-surface-1"
            : "border-border bg-surface-1"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded text-xs font-mono font-bold ${
              isComplete
                ? "bg-[#3ecf8e]/15 text-[#3ecf8e] border border-[#3ecf8e]/40"
                : isLocked
                  ? "bg-surface-2 text-gray-500 border border-border"
                  : "bg-surface-2 text-white border border-gray-600"
            }`}
          >
            {stageNum}
          </div>
          <div>
            <h3
              className={`text-sm font-semibold tracking-tight ${
                isLocked ? "text-gray-400" : "text-[#f0f0f0]"
              }`}
            >
              Stage {stageNum}: {info.title}
            </h3>
            <p className="text-xs text-[#a0a0a5]">{info.desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-white tabular-nums">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {!isLocked && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1c] border border-[#26262c]">
          <div
            className="h-full rounded-full bg-[#3ecf8e] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
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

      let lessonResult = await supabase
        .from("lessons")
        .select("*")
        .order("stage", { ascending: true })
        .order("order_index", { ascending: true });

      if (lessonResult.error) {
        lessonResult = await supabase
          .from("lessons")
          .select("*")
          .order("order_index", { ascending: true });
      }

      if (lessonResult.error) {
        setError("Failed to load lessons.");
        console.error("Lessons fetch error:", lessonResult.error);
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressErr } = await supabase
        .from("progress")
        .select("lesson_id")
        .eq("user_id", user.id);

      if (progressErr) {
        console.error("Progress fetch error:", progressErr);
      }

      setLessons(lessonResult.data || []);
      setCompletedLessonIds(
        new Set((progressData || []).map((p) => p.lesson_id))
      );
      setLoading(false);
    }

    fetchData();
  }, [user]);

  function isUnlocked(globalIndex) {
    if (globalIndex === 0) return true;
    const prevLesson = lessons[globalIndex - 1];
    return completedLessonIds.has(prevLesson.id);
  }

  function isCompleted(lessonId) {
    return completedLessonIds.has(lessonId);
  }

  const lessonsByStage = useMemo(() => {
    const grouped = new Map();
    lessons.forEach((lesson, globalIndex) => {
      const stage = lesson.stage || 1;
      if (!grouped.has(stage)) grouped.set(stage, []);
      grouped.get(stage).push({ ...lesson, _globalIndex: globalIndex });
    });
    return [...grouped.entries()].sort(([a], [b]) => a - b);
  }, [lessons]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border border-surface-3 border-t-[#3ecf8e]" />
        <p className="text-xs text-[#a0a0a5] font-mono">Loading curriculum…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-xs text-red-400 font-mono">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="cursor-pointer rounded-md border border-border bg-surface-1 px-3 py-1.5 text-xs text-gray-200 hover:border-gray-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-xs text-[#a0a0a5] font-mono">No lessons available.</p>
      </div>
    );
  }

  const completedCount = lessons.filter((l) => isCompleted(l.id)).length;
  const progressPct = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      {/* ── Header ── */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#f0f0f0]">
          Curriculum
        </h1>
        <p className="mt-1.5 text-xs text-[#a0a0a5]">
          7 stages · 56 lessons. Complete in sequence to master developer touch typing.
        </p>
      </header>

      {/* ── Overall Progress Bar ── */}
      <div className="mb-8 rounded-lg border border-border bg-surface-1 p-4">
        <div className="flex items-center justify-between text-xs mb-2.5">
          <span className="text-[#a0a0a5] font-medium">Overall Completion</span>
          <span className="font-mono text-white font-bold tabular-nums">
            <span className="text-[#3ecf8e]">{completedCount}</span> / {lessons.length} ({progressPct}%)
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1c] border border-[#26262c]">
          <div
            className="h-full rounded-full bg-[#3ecf8e] transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* ── Stages ── */}
      <div className="space-y-6">
        {lessonsByStage.map(([stageNum, stageItems]) => {
          const stageCompletedCount = stageItems.filter((l) =>
            isCompleted(l.id)
          ).length;
          const isStageFirstLessonLocked = !isUnlocked(stageItems[0]._globalIndex);

          return (
            <div key={stageNum} className="space-y-2">
              {/* Stage Header */}
              <StageHeader
                stageNum={stageNum}
                completedCount={stageCompletedCount}
                totalCount={stageItems.length}
                isLocked={isStageFirstLessonLocked}
              />

              {/* Lesson cards within stage */}
              <div className="grid gap-1.5 pl-3 border-l-2 border-border/60 ml-3">
                {stageItems.map((lesson, lessonIdx) => {
                  const unlocked = isUnlocked(lesson._globalIndex);
                  const completed = isCompleted(lesson.id);
                  const diffClass = DIFFICULTY_STYLES[lesson.difficulty] || DIFFICULTY_STYLES.beginner;
                  const LangIcon = LANG_ICONS[lesson.language] || DefaultLangIcon;

                  return (
                    <button
                      key={lesson.id}
                      id={`lesson-card-${lesson._globalIndex}`}
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
                      className={`group relative flex items-center justify-between rounded-md border px-3.5 py-2.5 text-left transition-colors ${
                        unlocked
                          ? completed
                            ? "border-border bg-surface-1 hover:border-gray-500 hover:bg-surface-2"
                            : "border-border bg-surface-1 hover:border-gray-500 hover:bg-surface-2"
                          : "cursor-not-allowed border-border/40 bg-surface-1/20 opacity-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status icon */}
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-xs">
                          {completed ? (
                            <CheckIcon />
                          ) : unlocked ? (
                            <span className="text-[10px] font-mono font-semibold text-gray-400">
                              {stageNum}.{lessonIdx + 1}
                            </span>
                          ) : (
                            <LockIcon />
                          )}
                        </div>

                        {/* Lesson title + lang */}
                        <div className="min-w-0 flex-1 flex items-center gap-2">
                          <LangIcon />
                          <span
                            className={`truncate text-xs font-semibold ${
                              unlocked ? "text-[#f0f0f0]" : "text-gray-500"
                            }`}
                          >
                            {lesson.title}
                          </span>
                        </div>
                      </div>

                      {/* Difficulty & language tags */}
                      <div className="flex items-center gap-2.5 shrink-0 ml-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium lowercase ${diffClass}`}>
                          {lesson.difficulty}
                        </span>
                        {unlocked && (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-white"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer ── */}
      <footer className="mt-12 text-center text-xs text-[#a0a0a5]">
        <p>Progress saves automatically after each completed lesson.</p>
      </footer>
    </div>
  );
}
