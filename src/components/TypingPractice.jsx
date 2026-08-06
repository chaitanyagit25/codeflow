import { useState, useEffect, useRef, useCallback } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";

/* ── Stat Card ── */
function StatCard({ label, value, unit, delay = 0, icon }) {
  return (
    <div
      className="flex flex-col items-center gap-1 rounded-xl border border-border bg-surface-2/50 px-6 py-4 backdrop-blur-sm animate-count-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <span className="text-xs font-medium uppercase tracking-widest text-muted">
        {icon} {label}
      </span>
      <span className="text-3xl font-bold text-accent-bright tabular-nums">
        {value}
      </span>
      {unit && <span className="text-xs text-muted">{unit}</span>}
    </div>
  );
}

/* ── Results Panel ── */
function ResultsPanel({ wpm, accuracy, correctChars, totalChars, timeTaken, onRestart, onBack }) {
  return (
    <div className="animate-slide-down space-y-6 rounded-2xl border border-border bg-surface-1/80 p-8 backdrop-blur-md">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-accent-bright">
          🎉 Complete!
        </h2>
        <p className="mt-1 text-sm text-muted">
          Here's how you did
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Speed" value={wpm} unit="WPM" delay={100} icon="⚡" />
        <StatCard label="Accuracy" value={`${accuracy}%`} delay={200} icon="🎯" />
        <StatCard label="Correct" value={correctChars} unit={`/ ${totalChars}`} delay={300} icon="✅" />
        <StatCard label="Time" value={`${timeTaken}s`} delay={400} icon="⏱" />
      </div>

      {/* Rating bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Accuracy</span>
          <span>{accuracy}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-3">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${accuracy}%`,
              background:
                accuracy >= 95
                  ? "linear-gradient(90deg, #34d399, #6ee7b7)"
                  : accuracy >= 80
                    ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                    : "linear-gradient(90deg, #f87171, #ef4444)",
            }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={onRestart}
          className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-surface-2 px-6 py-2.5 text-sm font-medium text-gray-300 transition-all hover:border-accent hover:text-white"
        >
          <span className="relative z-10">↻ Retry</span>
        </button>
        <button
          onClick={onBack}
          className="group relative cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110"
        >
          <span className="relative z-10">← Back to Lessons</span>
        </button>
      </div>
    </div>
  );
}

/* ── Main Typing Practice Component ── */
export default function TypingPractice({ lesson, onBack }) {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [shakeIndex, setShakeIndex] = useState(-1);
  const [isCurrentWrong, setIsCurrentWrong] = useState(false);
  const [mistakeIndices, setMistakeIndices] = useState(new Set());
  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const shakeTimerRef = useRef(null);
  const progressSavedRef = useRef(false);
  const { user } = useAuth();

  const targetText = lesson.code;
  const isComplete = userInput.length >= targetText.length && userInput.length > 0;

  // Live timer
  useEffect(() => {
    if (isActive && startTime && !endTime) {
      timerRef.current = setInterval(() => {
        setElapsedTime(((Date.now() - startTime) / 1000).toFixed(1));
      }, 100);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, startTime, endTime]);

  // Mark complete
  useEffect(() => {
    if (isComplete && !endTime) {
      setEndTime(Date.now());
      setIsActive(false);
      clearInterval(timerRef.current);
    }
  }, [isComplete, endTime]);

  // Save progress to Supabase when a snippet is completed
  useEffect(() => {
    if (!endTime || progressSavedRef.current || !user) return;
    progressSavedRef.current = true;

    const words = userInput.length / 5;
    const mins = (endTime - startTime) / 60000;
    const finalWpm = mins > 0 ? Math.round(words / mins) : 0;

    const total = userInput.length + wrongAttempts;
    const finalAccuracy = total > 0 ? Math.round((userInput.length / total) * 100) : 100;

    supabase
      .from("progress")
      .insert({
        user_id: user.id,
        lesson_id: lesson.id,
        wpm: finalWpm,
        accuracy: finalAccuracy,
        completed_at: new Date(endTime).toISOString(),
      })
      .then(({ error }) => {
        if (error) console.error("Failed to save progress:", error);
      });
  }, [endTime, user, userInput, wrongAttempts, startTime, lesson.id]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Global keydown handler — strict mode: only advance on correct key
  const handleKeyDown = useCallback(
    (e) => {
      if (isComplete) return;

      // Prevent default for keys we handle
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
      }

      // Backspace — go back one character
      if (e.key === "Backspace") {
        e.preventDefault();
        setUserInput((prev) => prev.slice(0, -1));
        setIsCurrentWrong(false);
        setShakeIndex(-1);
        return;
      }

      // Ignore modifier keys and non-character keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length > 1 && e.key !== "Tab" && e.key !== "Enter") return;

      // Determine what character was pressed
      let typedChar;
      if (e.key === "Tab") {
        // Tab inserts 4 spaces one at a time — but we match the target
        typedChar = targetText[userInput.length];
        // Only allow tab if the next expected chars are spaces
        if (typedChar !== " ") return;
        // Insert spaces up to the next 4 or until non-space
        let spacesToInsert = "";
        for (let i = 0; i < 4; i++) {
          if (targetText[userInput.length + i] === " ") {
            spacesToInsert += " ";
          } else {
            break;
          }
        }
        if (spacesToInsert.length > 0) {
          if (!startTime) {
            setStartTime(Date.now());
            setIsActive(true);
          }
          setUserInput((prev) => prev + spacesToInsert);
        }
        return;
      } else if (e.key === "Enter") {
        // Enter: auto-skip newline + all leading whitespace on the next line
        const expectedChar = targetText[userInput.length];
        if (expectedChar !== "\n") return;

        // Start timer on first keypress
        if (!startTime) {
          setStartTime(Date.now());
          setIsActive(true);
        }

        // Collect the newline + all leading spaces/tabs on the next line
        let autoInsert = "\n";
        let nextIdx = userInput.length + 1;
        while (nextIdx < targetText.length && (targetText[nextIdx] === " " || targetText[nextIdx] === "\t")) {
          autoInsert += targetText[nextIdx];
          nextIdx++;
        }
        setUserInput((prev) => prev + autoInsert);
        setShakeIndex(-1);
        setIsCurrentWrong(false);
        return;
      } else {
        typedChar = e.key;
      }

      const expectedChar = targetText[userInput.length];

      // Start timer on first keypress
      if (!startTime) {
        setStartTime(Date.now());
        setIsActive(true);
      }

      if (typedChar === expectedChar) {
        // Correct — advance
        setUserInput((prev) => prev + typedChar);
        setShakeIndex(-1);
        setIsCurrentWrong(false);
      } else {
        // Wrong — don't advance, mark current char as wrong and shake
        setWrongAttempts((prev) => prev + 1);
        setIsCurrentWrong(true);
        setMistakeIndices((prev) => new Set(prev).add(userInput.length));
        setShakeIndex(userInput.length);
        clearTimeout(shakeTimerRef.current);
        shakeTimerRef.current = setTimeout(() => setShakeIndex(-1), 400);
      }
    },
    [isComplete, userInput, targetText, startTime]
  );

  /* ── Computed stats ── */
  // In strict mode every char in userInput is correct
  const correctChars = userInput.length;
  const totalKeystrokes = userInput.length + wrongAttempts;
  const accuracy =
    totalKeystrokes > 0
      ? Math.round((correctChars / totalKeystrokes) * 100)
      : 100;

  const timeTaken = endTime
    ? ((endTime - startTime) / 1000).toFixed(1)
    : elapsedTime;

  const wordsTyped = correctChars / 5;
  const minutes = endTime
    ? (endTime - startTime) / 60000
    : startTime
      ? (Date.now() - startTime) / 60000
      : 0;
  const wpm = minutes > 0 ? Math.round(wordsTyped / minutes) : 0;

  const progress = Math.min(
    (userInput.length / targetText.length) * 100,
    100
  );

  /* ── Reset / Next ── */
  const resetPractice = () => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setIsActive(false);
    setElapsedTime(0);
    setWrongAttempts(0);
    setShakeIndex(-1);
    setIsCurrentWrong(false);
    setMistakeIndices(new Set());
    clearInterval(timerRef.current);
    clearTimeout(shakeTimerRef.current);
    progressSavedRef.current = false;
    containerRef.current?.focus();
  };

  /* ── Render characters ── */
  const renderCodeDisplay = () => {
    return targetText.split("").map((char, index) => {
      let colorClass = "text-gray-500"; // untyped
      let extraClass = "";

      if (index < userInput.length) {
        if (mistakeIndices.has(index)) {
          // This position had a wrong attempt — show red with underline
          colorClass = "text-incorrect";
          extraClass = "underline decoration-incorrect/60 decoration-2 underline-offset-4";
        } else {
          colorClass = "text-correct";
        }
      }

      // Current cursor position
      const isCursor = index === userInput.length && !isComplete;
      const isShaking = index === shakeIndex;

      // Show red on current char if wrong key was pressed
      if (isCursor && isCurrentWrong) {
        colorClass = "text-incorrect";
        extraClass = "bg-incorrect/15 rounded-[2px]";
      }

      if (isShaking) {
        extraClass += " animate-shake";
      }

      return (
        <span key={index} className={`relative inline ${extraClass}`}>
          {isCursor && (
            <span className="absolute -left-[1px] top-0 h-full w-[2px] bg-cursor animate-blink rounded-full" />
          )}
          <span className={`${colorClass} transition-colors duration-75`}>
            {char === "\n" ? "\n" : char === " " ? "\u00A0" : char}
          </span>
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-surface-0 font-sans">
      {/* ── Ambient gradient background ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-indigo-600/[0.07] blur-[120px]" />
        <div className="absolute -bottom-1/3 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/[0.05] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-10 animate-fade-in-up">
          <button
            id="back-to-lessons-btn"
            onClick={onBack}
            className="mb-6 cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent/50 hover:text-gray-300"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Lessons
          </button>
          <div className="text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-4 py-1.5 text-xs font-medium text-muted backdrop-blur-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-correct animate-pulse" />
              Typing Practice
            </div>
            <h2 className="text-2xl font-bold text-gray-200 sm:text-3xl">
              {lesson.title}
            </h2>
            <p className="mt-2 text-sm text-muted">
              Type the code below — accuracy counts!
            </p>
          </div>
        </header>

        {/* ── Live Stats Bar ── */}
        <div
          className="mb-4 flex items-center justify-between rounded-xl border border-border bg-surface-1/60 px-5 py-3 backdrop-blur-sm animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex items-center gap-6 text-xs">
            <span className="flex items-center gap-1.5 text-muted">
              <span className="text-accent">⚡</span> WPM:{" "}
              <span className="font-semibold text-gray-200 tabular-nums">{wpm}</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span className="text-correct">🎯</span> Accuracy:{" "}
              <span className="font-semibold text-gray-200 tabular-nums">{accuracy}%</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted">
              <span>⏱</span> Time:{" "}
              <span className="font-semibold text-gray-200 tabular-nums">{timeTaken}s</span>
            </span>
          </div>
          <div className="text-xs text-muted">
            {userInput.length} / {targetText.length} chars
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mb-6 h-1 overflow-hidden rounded-full bg-surface-3 animate-fade-in-up" style={{ animationDelay: "250ms" }}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Code Display ── */}
        <div
          className="mb-4 animate-fade-in-up"
          style={{ animationDelay: "300ms" }}
          onClick={() => containerRef.current?.focus()}
        >
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="overflow-hidden rounded-2xl border border-border bg-surface-1/80 shadow-2xl shadow-black/20 backdrop-blur-md outline-none focus:ring-1 focus:ring-accent/30"
          >
            {/* Title bar */}
            <div className="flex items-center gap-2 border-b border-border bg-surface-2/60 px-4 py-2.5">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="ml-2 text-xs text-muted font-medium">{lesson.title}</span>
              <span className="ml-auto rounded-md bg-surface-3/60 px-2 py-0.5 text-[10px] text-muted uppercase tracking-wider">
                {lesson.language}
              </span>
            </div>

            {/* Code area */}
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-7 select-none">
              <code>{renderCodeDisplay()}</code>
            </pre>
          </div>
        </div>

        {/* ── Prompt ── */}
        {!isActive && !isComplete && userInput.length === 0 && (
          <div className="mb-6 text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
            <p className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border bg-surface-2/30 px-5 py-3 text-sm text-muted">
              <span className="animate-pulse text-accent">▸</span>
              Click above or start typing to begin
            </p>
          </div>
        )}

        {/* ── Results Panel ── */}
        {isComplete && (
          <div className="mt-6">
            <ResultsPanel
              wpm={wpm}
              accuracy={accuracy}
              correctChars={correctChars}
              totalChars={targetText.length}
              timeTaken={timeTaken}
              wrongAttempts={wrongAttempts}
              onRestart={resetPractice}
              onBack={onBack}
            />
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 text-center text-xs text-muted/60 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <p>
            <span className="text-accent/60">Tab</span> inserts 4 spaces
            &nbsp;·&nbsp;
            <span className="text-accent/60">↵</span> for newlines
            &nbsp;·&nbsp;
            Built with React + Tailwind
          </p>
        </footer>
      </div>
    </div>
  );
}
