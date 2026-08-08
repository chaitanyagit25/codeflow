import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";
import { getFingerForChar, needsShift } from "../lib/fingerMap";
import VirtualKeyboard from "./VirtualKeyboard";
import HandGuide from "./HandGuide";

/* ── Stat Card ── */
function StatCard({ label, value, unit }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-md border border-border bg-surface-2 p-4">
      <span className="text-[11px] font-mono text-[#a0a0a5] uppercase tracking-wider font-medium">
        {label}
      </span>
      <span className="text-2xl font-bold font-mono text-white tabular-nums">
        {value}
      </span>
      {unit && <span className="text-[10px] text-[#a0a0a5] font-mono">{unit}</span>}
    </div>
  );
}

/* ── Results Panel ── */
function ResultsPanel({ wpm, accuracy, correctChars, totalChars, timeTaken, onRestart, onBack }) {
  return (
    <div className="animate-slide-down space-y-6 rounded-lg border border-border bg-surface-1 p-6 sm:p-8">
      <div className="text-center">
        <h2 className="text-xl font-bold tracking-tight text-[#f0f0f0]">
          Lesson Complete
        </h2>
        <p className="mt-1 text-xs text-[#a0a0a5]">
          Performance summary
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Speed" value={wpm} unit="WPM" />
        <StatCard label="Accuracy" value={`${accuracy}%`} />
        <StatCard label="Correct" value={correctChars} unit={`/ ${totalChars}`} />
        <StatCard label="Time" value={`${timeTaken}s`} />
      </div>

      {/* Rating bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-[#a0a0a5]">
          <span>Accuracy</span>
          <span className="text-white font-bold">{accuracy}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[#1a1a1c] border border-[#26262c]">
          <div
            className="h-full rounded-full bg-[#3ecf8e] transition-all duration-500 ease-out"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      <div className="flex justify-center gap-3 pt-2">
        <button
          onClick={onRestart}
          className="cursor-pointer rounded-md border border-border bg-surface-2 px-5 py-2 text-xs font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
        >
          ↻ Retry
        </button>
        <button
          onClick={onBack}
          className="cursor-pointer rounded-md bg-white px-5 py-2 text-xs font-bold text-gray-900 shadow-sm transition-all hover:bg-gray-200 active:scale-[0.98]"
        >
          ← Next Lesson
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

  const targetText = useMemo(
    () => (lesson.code || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
    [lesson.code]
  );
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

      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
      }

      if (e.key === "Backspace") {
        e.preventDefault();
        setUserInput((prev) => prev.slice(0, -1));
        setIsCurrentWrong(false);
        setShakeIndex(-1);
        return;
      }

      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key.length > 1 && e.key !== "Tab" && e.key !== "Enter") return;

      let typedChar;
      if (e.key === "Tab") {
        typedChar = targetText[userInput.length];
        if (typedChar !== " ") return;
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
        const nextNewlineIdx = targetText.indexOf("\n", userInput.length);
        if (nextNewlineIdx === -1) return;

        let canJump = true;
        for (let i = userInput.length; i < nextNewlineIdx; i++) {
          if (targetText[i] !== " " && targetText[i] !== "\t") {
            canJump = false;
            break;
          }
        }

        if (!canJump) {
          setWrongAttempts((prev) => prev + 1);
          setIsCurrentWrong(true);
          setMistakeIndices((prev) => new Set(prev).add(userInput.length));
          setShakeIndex(userInput.length);
          clearTimeout(shakeTimerRef.current);
          shakeTimerRef.current = setTimeout(() => setShakeIndex(-1), 400);
          return;
        }

        if (!startTime) {
          setStartTime(Date.now());
          setIsActive(true);
        }

        let autoInsert = targetText.slice(userInput.length, nextNewlineIdx + 1);
        let nextIdx = nextNewlineIdx + 1;
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

      if (!startTime) {
        setStartTime(Date.now());
        setIsActive(true);
      }

      if (typedChar === expectedChar) {
        setUserInput((prev) => prev + typedChar);
        setShakeIndex(-1);
        setIsCurrentWrong(false);
      } else {
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

  /* ── Next-char & finger info ── */
  const nextChar = isComplete ? null : (targetText[userInput.length] ?? null);
  const activeFinger = useMemo(() => getFingerForChar(nextChar), [nextChar]);
  const shiftFinger = useMemo(() => {
    if (!needsShift(nextChar)) return null;
    return activeFinger?.startsWith("left") ? "right-pinky" : "left-pinky";
  }, [nextChar, activeFinger]);

  /* ── Reset ── */
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
          colorClass = "text-red-400";
          extraClass = "underline decoration-red-400/60 decoration-2 underline-offset-4";
        } else {
          colorClass = "text-[#3ecf8e]";
        }
      }

      const isCursor = index === userInput.length && !isComplete;
      const isShaking = index === shakeIndex;

      if (isCursor && isCurrentWrong) {
        colorClass = "text-red-400";
        extraClass = "bg-red-500/20 rounded-[2px]";
      }

      if (isShaking) {
        extraClass += " animate-shake";
      }

      return (
        <span key={index} className={`relative inline ${extraClass}`}>
          {isCursor && (
            <span className="absolute -left-[1px] top-0 h-full w-[2px] bg-[#3ecf8e] animate-blink rounded-full" />
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
      <div className="relative mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <header className="mb-6 flex items-center justify-between">
          <button
            id="back-to-lessons-btn"
            onClick={onBack}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-1 px-3 py-1.5 text-xs font-semibold text-gray-200 transition-colors hover:border-gray-500 hover:text-white"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Curriculum
          </button>
          <div className="text-right">
            <h2 className="text-sm font-semibold tracking-tight text-[#f0f0f0]">
              {lesson.title}
            </h2>
            <span className="text-[10px] font-mono text-[#a0a0a5] uppercase tracking-wider font-medium">
              {lesson.language}
            </span>
          </div>
        </header>

        {/* ── Live Stats Bar ── */}
        <div className="mb-3 flex items-center justify-between rounded-md border border-border bg-surface-1 px-4 py-3 text-xs font-mono">
          <div className="flex items-center gap-6">
            <span className="text-[#a0a0a5] font-medium">
              WPM: <span className="font-bold text-[#3ecf8e] text-sm tabular-nums">{wpm}</span>
            </span>
            <span className="text-[#a0a0a5] font-medium">
              Accuracy: <span className="font-bold text-white text-sm tabular-nums">{accuracy}%</span>
            </span>
            <span className="text-[#a0a0a5] font-medium">
              Time: <span className="font-bold text-white text-sm tabular-nums">{timeTaken}s</span>
            </span>
          </div>
          <div className="text-[#a0a0a5] font-semibold text-xs tabular-nums">
            {userInput.length} / {targetText.length}
          </div>
        </div>

        {/* ── Progress Bar ── */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1c] border border-[#26262c]">
          <div
            className="h-full rounded-full bg-[#3ecf8e] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Code Display ── */}
        <div
          className="mb-6"
          onClick={() => containerRef.current?.focus()}
        >
          <div
            ref={containerRef}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="overflow-hidden rounded-md border border-border bg-[#121215] outline-none focus:border-gray-500"
          >
            {/* Title bar */}
            <div className="flex items-center justify-between border-b border-border bg-surface-1 px-4 py-2.5 text-xs font-mono text-gray-300">
              <span className="truncate font-medium">{lesson.title}</span>
              <span className="text-[10px] text-[#a0a0a5] uppercase font-bold">{lesson.language}</span>
            </div>

            {/* Code area */}
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-relaxed select-none">
              <code>{renderCodeDisplay()}</code>
            </pre>
          </div>
        </div>

        {/* ── Keyboard Guide ── */}
        <div className="mb-6 space-y-4">
          <HandGuide activeFinger={activeFinger} shiftFinger={shiftFinger} />
          <VirtualKeyboard nextChar={nextChar} />
        </div>

        {/* ── Prompt ── */}
        {!isActive && !isComplete && userInput.length === 0 && (
          <div className="mb-6 text-center">
            <p className="inline-flex items-center gap-2 rounded-md border border-border bg-surface-1 px-4 py-2 text-xs font-mono text-gray-300">
              <span className="text-[#3ecf8e] font-bold">▸</span>
              Click box and start typing to begin
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
        <footer className="mt-12 text-center text-xs text-[#a0a0a5] font-mono">
          <p>
            Tab = 4 spaces &nbsp;·&nbsp; Enter = newline &nbsp;·&nbsp; Strict character matching
          </p>
        </footer>
      </div>
    </div>
  );
}
