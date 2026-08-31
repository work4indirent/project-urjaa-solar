import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (s) => {
    if (!s?.user) { setProfile(null); return; }
    const { data } = await supabase.from("profiles").select("id, role, full_name").eq("id", s.user.id).single();
    setProfile(data || null);
  };

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;
      setSession(session);
      await loadProfile(session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(async (_e, next) => {
      setSession(next);
      await loadProfile(next);
      setLoading(false);
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
