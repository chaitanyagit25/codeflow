import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

/**
 * Lightweight auth hook.
 * Returns { user, loading, signInWithGitHub, signOut }.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Grab the current session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for future auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGitHub = () =>
    supabase.auth.signInWithOAuth({ provider: "github" });

  const signOut = () => supabase.auth.signOut();

  return { user, loading, signInWithGitHub, signOut };
}
