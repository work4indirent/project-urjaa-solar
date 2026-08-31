import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { ArrowRight, FileText, LayoutDashboard, Loader2, LogOut, Package, Sun, Users, Wrench, Landmark, FolderKanban } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { COMPANY } from "@/lib/company";

function AdminLogin() {
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [message, setMessage] = useState(""), [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setMessage(error.message);
  };
  return (
    <main className="workspace-page">
      <div className="workspace-card">
        <img className="workspace-logo" src={COMPANY.logo} alt="URJAA Solar Energy" />
        <span className="eyebrow">Team workspace</span>
        <h1>URJAA operations.</h1>
        <p>A secure workspace for leads, quotations, products, projects, subsidies and service requests.</p>
        <form onSubmit={submit} data-testid="auth-form">
          <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="auth-email-input" /></label>
          <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="auth-password-input" /></label>
          <button className="button button-dark" disabled={loading} data-testid="auth-submit-button">{loading ? "Signing in…" : "Sign in"} <ArrowRight size={16} /></button>
        </form>
        {message && <p className="form-status" data-testid="auth-message">{message}</p>}
        <small className="demo-label">Staff access only. Accounts are provisioned by the administrator.</small>
      </div>
    </main>
  );
}

const links = [
  ["", "Dashboard", LayoutDashboard],
  ["leads", "Leads", Users],
  ["quotations", "Quotations", FileText],
  ["products", "Products", Package],
  ["projects", "Projects", FolderKanban],
  ["subsidies", "Subsidies", Landmark],
  ["services", "Services", Wrench],
];

export default function AdminLayout() {
  const { user, profile, loading } = useAuth();
  const nav = useNavigate();
  if (loading) return <main className="workspace-page"><Loader2 className="spin" size={30} /></main>;
  if (!user) return <AdminLogin />;
  if (!profile || !["admin", "staff"].includes(profile.role)) {
    return (
      <main className="workspace-page">
        <div className="workspace-card" data-testid="admin-no-access">
          <span className="eyebrow">Team workspace</span>
          <h1>No staff access.</h1>
          <p>This account ({user.email}) does not have staff permissions. Contact the administrator.</p>
          <button className="button button-dark" onClick={async () => { await supabase.auth.signOut(); }} data-testid="admin-signout-button">Sign out <LogOut size={15} /></button>
        </div>
      </main>
    );
  }
  return (
    <div className="admin-shell" data-testid="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => nav("/")}>
          <img src={COMPANY.logo} alt="URJAA" /><span>URJAA<small>OPERATIONS</small></span>
        </div>
        <nav>
          {links.map(([path, label, Icon]) => (
            <NavLink key={label} to={`/admin/${path}`} end={path === ""} data-testid={`admin-nav-${label.toLowerCase()}`}><Icon size={16} /> {label}</NavLink>
          ))}
        </nav>
        <div className="admin-user">
          <Sun size={14} /> <span>{user.email}</span>
          <button onClick={async () => { await supabase.auth.signOut(); }} data-testid="admin-logout-button"><LogOut size={15} /></button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
