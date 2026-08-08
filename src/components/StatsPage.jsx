import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/useAuth";

/* ── Stage metadata ── */
const STAGE_INFO = {
  1: { title: "Home Row" },
  2: { title: "Top Row" },
  3: { title: "Bottom Row" },
  4: { title: "Numbers" },
  5: { title: "Symbols" },
  6: { title: "Short Code" },
  7: { title: "Full Code" },
};

/* ── Stat Card ── */
function StatCard({ label, value, sub }) {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border bg-surface-1 p-4">
      <span className="text-[11px] font-mono text-[#a0a0a5] uppercase tracking-wider font-semibold">
        {label}
      </span>
      <div className="mt-3">
        <div className="text-2xl font-bold font-mono text-white tabular-nums">
          {value}
        </div>
        {sub && <div className="mt-1 text-[10px] font-mono text-[#a0a0a5]">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Stage Progress Row ── */
function StageRow({ stageNum, completed, total }) {
  const info = STAGE_INFO[stageNum] || { title: `Stage ${stageNum}` };
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isDone = completed === total && total > 0;

  return (
    <div className="rounded-lg border border-border bg-surface-1 px-4 py-3.5">
      <div className="flex items-center justify-between text-xs mb-2">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold text-white bg-surface-2 px-1.5 py-0.5 rounded border border-border">Stage {stageNum}</span>
          <span className="font-semibold text-[#f0f0f0]">{info.title}</span>
        </div>
        <span className={`font-mono font-bold tabular-nums ${isDone ? "text-[#3ecf8e]" : "text-white"}`}>
          {completed}/{total}
        </span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a1a1c] border border-[#26262c]">
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            isDone ? "bg-[#3ecf8e]" : "bg-[#3ecf8e]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/* ── Main Stats Page ── */
export default function StatsPage({ onBack, streakData }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalLessons: 0,
    avgWpm: 0,
    avgAccuracy: 0,
  });
  const [stageProgress, setStageProgress] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const { data: progressData, error: progressError } = await supabase
        .from("progress")
        .select("lesson_id, wpm, accuracy")
        .eq("user_id", user.id);

      if (progressError) {
        console.error("Failed to fetch progress:", progressError);
        setLoading(false);
        return;
      }

      const total = progressData.length;
      const avgWpm =
        total > 0
          ? Math.round(progressData.reduce((sum, r) => sum + r.wpm, 0) / total)
          : 0;
      const avgAccuracy =
        total > 0
          ? Math.round(
              progressData.reduce((sum, r) => sum + Number(r.accuracy), 0) / total
            )
          : 0;

      setStats({ totalLessons: total, avgWpm, avgAccuracy });

      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("id, stage")
        .order("stage")
        .order("order_index");

      if (lessonsError) {
        console.error("Failed to fetch lessons:", lessonsError);
        setLoading(false);
        return;
      }

      const completedIds = new Set(progressData.map((r) => r.lesson_id));

      const stageMap = {};
      for (const lesson of lessonsData) {
        const s = lesson.stage;
        if (!stageMap[s]) stageMap[s] = { total: 0, completed: 0 };
        stageMap[s].total++;
        if (completedIds.has(lesson.id)) stageMap[s].completed++;
      }

      const stages = Object.entries(stageMap)
        .map(([stage, data]) => ({
          stage: Number(stage),
          completed: data.completed,
          total: data.total,
        }))
        .sort((a, b) => a.stage - b.stage);

      setStageProgress(stages);
      setLoading(false);
    };

    fetchStats();
  }, [user]);

  const { currentStreak, longestStreak } = streakData;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="h-5 w-5 animate-spin rounded-full border border-surface-3 border-t-[#3ecf8e]" />
        <p className="text-xs text-[#a0a0a5] font-mono">Loading statistics…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-0 font-sans">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
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
            <h1 className="text-sm font-bold tracking-tight text-[#f0f0f0]">
              Overview
            </h1>
            <p className="text-[10px] font-mono text-[#a0a0a5] uppercase font-semibold">
              User Statistics
            </p>
          </div>
        </header>

        {/* Stat Cards Grid */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Current Streak"
            value={currentStreak}
            sub={currentStreak === 1 ? "day" : "days"}
          />
          <StatCard
            label="Best Streak"
            value={longestStreak}
            sub={longestStreak === 1 ? "day" : "days"}
          />
          <StatCard
            label="Completed"
            value={stats.totalLessons}
            sub="lessons"
          />
          <StatCard
            label="Avg Speed"
            value={stats.avgWpm}
            sub="WPM"
          />
          <StatCard
            label="Avg Accuracy"
            value={`${stats.avgAccuracy}%`}
            sub="overall"
          />
        </div>

        {/* Stage Progress */}
        <div>
          <h2 className="mb-3 text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
            Stage Completion
          </h2>
          <div className="space-y-2">
            {stageProgress.map((sp) => (
              <StageRow
                key={sp.stage}
                stageNum={sp.stage}
                completed={sp.completed}
                total={sp.total}
              />
            ))}
            {stageProgress.length === 0 && (
              <div className="rounded-md border border-border bg-surface-1 p-6 text-center text-xs text-[#a0a0a5] font-mono">
                No completion data recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-[#a0a0a5] font-mono">
          <p>Statistics update live after each practice session.</p>
        </footer>
      </div>
    </div>
  );
}
