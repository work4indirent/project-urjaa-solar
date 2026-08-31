import { useEffect, useState } from "react";
import { ArrowRight, CircleUserRound, FileText, FolderKanban, Loader2, LogOut, MessageCircle, Wrench } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { inr, waLink } from "@/lib/company";

const PROJECT_PROGRESS = { planned: 15, survey: 35, in_progress: 70, commissioned: 100, closed: 100 };

function Portal({ user }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data: customers } = await supabase.from("customers").select("*").eq("profile_id", user.id);
      if (!customers?.length) { if (alive) setData({ active: false }); return; }
      const ids = customers.map((c) => c.id);
      const [q, p, s] = await Promise.all([
        supabase.from("quotations").select("*").in("customer_id", ids).order("created_at", { ascending: false }),
        supabase.from("projects").select("*").in("customer_id", ids).order("created_at", { ascending: false }),
        supabase.from("service_requests").select("*").in("customer_id", ids).order("created_at", { ascending: false }),
      ]);
      if (alive) setData({ active: true, customer: customers[0], quotations: q.data || [], projects: p.data || [], services: s.data || [] });
    })();
    return () => { alive = false; };
  }, [user.id]);

  if (!data) return <div className="portal-loading"><Loader2 className="spin" /> Loading your portal…</div>;
  if (!data.active) {
    return (
      <div className="workspace-card" data-testid="portal-not-active">
        <div className="workspace-icon"><CircleUserRound /></div>
        <span className="eyebrow">Customer portal</span>
        <h1>Your portal is almost ready.</h1>
        <p>You are signed in as {user.email}, but our team hasn't activated your portal yet. This usually happens right after we confirm your quotation on WhatsApp.</p>
        <a className="button button-whatsapp" href={waLink(`Hi URJAA Solar Energy, please activate my customer portal. My email is ${user.email}.`)} target="_blank" rel="noreferrer" data-testid="portal-activate-whatsapp"><MessageCircle size={16} /> Request activation on WhatsApp</a>
        <button className="quiet-button" onClick={() => supabase.auth.signOut()} data-testid="customer-signout-button">Sign out</button>
      </div>
    );
  }
  return (
    <div className="portal" data-testid="customer-portal">
      <div className="portal-head">
        <div>
          <span className="eyebrow">Customer portal</span>
          <h1>Hello, {data.customer.name.split(" ")[0]}.</h1>
          <p>Everything about your solar journey with URJAA, in one place.</p>
        </div>
        <button className="quiet-button" onClick={() => supabase.auth.signOut()} data-testid="customer-signout-button"><LogOut size={14} /> Sign out</button>
      </div>

      <section className="portal-section" data-testid="portal-quotations">
        <h2><FileText size={17} /> Your quotations</h2>
        {data.quotations.length === 0 ? <p className="portal-empty">No quotations linked yet.</p> : (
          <div className="portal-cards">
            {data.quotations.map((q) => (
              <div className="portal-card" key={q.id} data-testid="portal-quotation-card">
                <div className="portal-card-top"><b>{q.quote_ref || "Quotation"}</b><span className={`status-pill s-${q.status}`}>{q.status}</span></div>
                <div className="quote-summary-grid">
                  <div><small>System</small><b>{q.system_size_kw} kW</b></div>
                  <div><small>Indicative cost</small><b>{inr(q.estimated_cost)}</b></div>
                  <div><small>Indicative subsidy</small><b>{inr(q.estimated_subsidy)}</b></div>
                  <div className="highlight"><small>Payable</small><b>{inr(q.customer_payable)}</b></div>
                </div>
                <small className="quote-meta">{new Date(q.created_at).toLocaleDateString("en-IN")} · {[q.district, q.state].filter(Boolean).join(", ")}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="portal-section" data-testid="portal-projects">
        <h2><FolderKanban size={17} /> Project progress</h2>
        {data.projects.length === 0 ? <p className="portal-empty">No projects linked yet. Your installation will appear here once work is scheduled.</p> : (
          <div className="portal-cards">
            {data.projects.map((p) => (
              <div className="portal-card" key={p.id} data-testid="portal-project-card">
                <div className="portal-card-top"><b>{p.name}</b><span className={`status-pill s-${p.status}`}>{(p.status || "").replace("_", " ")}</span></div>
                <div className="progress-track"><i style={{ width: `${PROJECT_PROGRESS[p.status] || 10}%` }} /></div>
                <div className="progress-steps">
                  {["planned", "survey", "in_progress", "commissioned"].map((s) => (
                    <span key={s} className={PROJECT_PROGRESS[p.status] >= PROJECT_PROGRESS[s] ? "done" : ""}>{s.replace("_", " ")}</span>
                  ))}
                </div>
                <small className="quote-meta">{[p.location, p.capacity && `${p.capacity} kW`, p.system_type].filter(Boolean).join(" · ")}</small>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="portal-section" data-testid="portal-services">
        <h2><Wrench size={17} /> Service requests</h2>
        {data.services.length === 0 ? <p className="portal-empty">No service tickets. Need help? Message us on WhatsApp and we'll raise one for you.</p> : (
          <div className="portal-cards">
            {data.services.map((s) => (
              <div className="portal-card" key={s.id} data-testid="portal-service-card">
                <div className="portal-card-top"><b>{s.service_type}</b><span className={`status-pill s-${s.status}`}>{(s.status || "").replace("_", " ")}</span></div>
                {s.description && <p className="portal-desc">{s.description}</p>}
                <small className="quote-meta">Raised {new Date(s.created_at).toLocaleDateString("en-IN")}</small>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function Customer() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState(""), [password, setPassword] = useState(""), [message, setMessage] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    const r = mode === "sign-in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    setMessage(r.error ? r.error.message : "");
  };
  return (
    <>
      <Header />
      <main className={user ? "portal-page" : "workspace-page"}>
        {loading ? <Loader2 className="spin" /> : user ? (
          <div className="container"><Portal user={user} /></div>
        ) : (
          <div className="workspace-card">
            <div className="workspace-icon"><CircleUserRound /></div>
            <span className="eyebrow">Customer portal</span>
            <h1>Your solar journey, in one place.</h1>
            <p>Sign in to view quotations, project progress and service requests linked to your account. Portals are activated by our team after your quotation is confirmed.</p>
            <form onSubmit={submit} data-testid="auth-form">
              <label>Email<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} data-testid="auth-email-input" /></label>
              <label>Password<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} data-testid="auth-password-input" /></label>
              <button className="button button-dark" data-testid="auth-submit-button">{mode === "sign-in" ? "Sign in" : "Create account"} <ArrowRight size={16} /></button>
            </form>
            {message && <p className="form-status" data-testid="auth-message">{message}</p>}
            <button className="quiet-button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")} data-testid="auth-toggle-button">{mode === "sign-in" ? "Need an account? Create one" : "Already registered? Sign in"}</button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
