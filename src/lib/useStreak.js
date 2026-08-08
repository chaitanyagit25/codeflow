import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/**
 * Hook that returns the current user's streak data.
 * Subscribes to Supabase Realtime so the UI updates instantly
 * when the database trigger modifies user_streaks.
 *
 * @param {string|null} userId - The authenticated user's ID
 * @returns {{ currentStreak: number, longestStreak: number, loading: boolean }}
 */
export function useStreak(userId) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    // ── Initial fetch ──
    const fetchStreak = async () => {
      const { data, error } = await supabase
        .from("user_streaks")
        .select("current_streak, longest_streak")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Failed to fetch streak:", error);
      } else if (data) {
        setCurrentStreak(data.current_streak);
        setLongestStreak(data.longest_streak);
      }
      // If data is null the user has never completed a lesson — defaults are 0
      setLoading(false);
    };

    fetchStreak();

    // ── Realtime subscription ──
    // Listen for INSERT (first completion) and UPDATE (subsequent) on user_streaks
    const channel = supabase
      .channel(`streak:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_streaks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new;
          if (row) {
            setCurrentStreak(row.current_streak);
            setLongestStreak(row.longest_streak);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { currentStreak, longestStreak, loading };
}
