import { useState } from "react";
import { ArrowRight, CircleUserRound, LogOut } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

export default function Customer() {
  const { user } = useAuth();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [message, setMessage] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const r = mode === "sign-in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    setMessage(r.error ? r.error.message : mode === "sign-in" ? "" : "Account created. Check your email to confirm access.");
  };
  return (
    <>
      <Header />
      <main className="workspace-page">
        <div className="workspace-card">
          <div className="workspace-icon"><CircleUserRound /></div>
          <span className="eyebrow">Customer portal</span>
          {user ? (
            <>
              <h1>Welcome back.</h1>
              <p>You are signed in as {user.email}. Your projects, quotations and service requests will appear here once records are linked to your account by our team.</p>
              <button className="button button-dark" onClick={() => supabase.auth.signOut()} data-testid="customer-signout-button">Sign out <LogOut size={15} /></button>
            </>
          ) : (
            <>
              <h1>Your solar journey, in one place.</h1>
              <p>Sign in to view enquiries, milestones, quotations and service requests linked to your account.</p>
              <form onSubmit={submit} data-testid="auth-form">
                <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="auth-email-input" /></label>
                <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="auth-password-input" /></label>
                <button className="button button-dark" data-testid="auth-submit-button">{mode === "sign-in" ? "Sign in" : "Create account"} <ArrowRight size={16} /></button>
              </form>
              {message && <p className="form-status" data-testid="auth-message">{message}</p>}
              <button className="quiet-button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} data-testid="auth-toggle-button">{mode === "sign-in" ? "Need an account? Create one" : "Already registered? Sign in"}</button>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
