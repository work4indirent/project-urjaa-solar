import { useMemo, useState } from "react";
import { ArrowRight, BadgeIndianRupee, CheckCircle2, MessageCircle, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/Reveal";
import { createQuotationRequest } from "@/lib/db";
import { centralSubsidy, inr, waLink } from "@/lib/company";
import { STATES, districtsFor } from "@/lib/geo";

const PANEL_TYPES = ["Monocrystalline", "Polycrystalline", "Bifacial", "Not sure — recommend for me"];

export default function Quotation() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", state: "Uttar Pradesh", district: "Pratapgarh", city: "", address: "", property_type: "Home", monthly_bill: 4000, roof_area: 600, panel_type: PANEL_TYPES[3] });
  const [done, setDone] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const districts = districtsFor(form.state);

  const est = useMemo(() => {
    const size = Math.max(1, Math.min(25, Math.round((form.monthly_bill / 850) * 10) / 10));
    const cost = Math.round(size * 55000);
    const subsidy = form.property_type === "Home" ? centralSubsidy(size) : 0;
    return { size, cost, subsidy, payable: Math.max(0, cost - subsidy) };
  }, [form.monthly_bill, form.property_type]);

  const update = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: name === "monthly_bill" || name === "roof_area" ? +value : value };
      if (name === "state") next.district = districtsFor(value)?.[0] || "";
      return next;
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const ref = `USE-${Date.now().toString(36).toUpperCase()}`;
    const payload = { quote_ref: ref, ...form, monthly_bill: form.monthly_bill, roof_area: form.roof_area, system_size_kw: est.size, estimated_cost: est.cost, estimated_subsidy: est.subsidy, customer_payable: est.payable };
    const { error: err } = await createQuotationRequest(payload);
    setLoading(false);
    if (err) { setError("We could not save your request just now. You can still send it on WhatsApp below, or call us."); setDone({ ref, saved: false }); }
    else setDone({ ref, saved: true });
  };

  const waText = done
    ? `Hello URJAA Solar Energy! My quotation request (${done.ref}):\n• Name: ${form.name}\n• Phone: ${form.phone}\n• Location: ${form.district}, ${form.state}${form.city ? ` (${form.city})` : ""}\n• Property: ${form.property_type}\n• Monthly bill: ${inr(form.monthly_bill)}\n• Roof area: ${form.roof_area} sq ft\n• Panel preference: ${form.panel_type}\n• Indicative system: ${est.size} kW\n• Indicative cost: ${inr(est.cost)}\n• Indicative subsidy: ${inr(est.subsidy)}\n• Indicative payable: ${inr(est.payable)}\nPlease confirm my final quotation.`
    : "";

  return (
    <>
      <Header />
      <main className="page-main quotation-page">
        <div className="page-hero">
          <div className="container">
            <span className="eyebrow">Instant quotation request</span>
            <h1>Your solar quotation, <em>without the wait.</em></h1>
            <p>Fill in your details to get an indicative quotation instantly, then send it straight to our WhatsApp Business for confirmation after a site survey.</p>
          </div>
        </div>
        <section className="section">
          <div className="container quote-layout">
            {!done ? (
              <form className="lead-form quote-form" onSubmit={submit} data-testid="quotation-form">
                <h2>Tell us about your site</h2>
                <div className="form-grid">
                  <label>Name<input required name="name" value={form.name} onChange={update} placeholder="Your name" data-testid="quote-name-input" /></label>
                  <label>Phone<input required name="phone" value={form.phone} onChange={update} placeholder="10-digit number" data-testid="quote-phone-input" /></label>
                  <label>Email<input type="email" name="email" value={form.email} onChange={update} placeholder="Optional" data-testid="quote-email-input" /></label>
                  <label>State
                    <select name="state" value={form.state} onChange={update} data-testid="quote-state-select">{STATES.map((s) => <option key={s}>{s}</option>)}</select>
                  </label>
                  <label>District
                    {districts ? (
                      <select name="district" value={form.district} onChange={update} data-testid="quote-district-select">{districts.map((d) => <option key={d}>{d}</option>)}</select>
                    ) : (
                      <input name="district" value={form.district} onChange={update} placeholder="Your district" data-testid="quote-district-input" />
                    )}
                  </label>
                  <label>City / Village<input name="city" value={form.city} onChange={update} placeholder="Optional" data-testid="quote-city-input" /></label>
                  <label className="wide">Site address<input name="address" value={form.address} onChange={update} placeholder="Optional — helps us plan the survey" data-testid="quote-address-input" /></label>
                  <label>Property type
                    <select name="property_type" value={form.property_type} onChange={update} data-testid="quote-property-select"><option>Home</option><option>Business</option><option>Institution</option><option>Farm</option></select>
                  </label>
                  <label>Panel preference
                    <select name="panel_type" value={form.panel_type} onChange={update} data-testid="quote-panel-select">{PANEL_TYPES.map((p) => <option key={p}>{p}</option>)}</select>
                  </label>
                  <label className="wide">Monthly electricity bill <output>{inr(form.monthly_bill)}</output>
                    <input type="range" name="monthly_bill" min="1000" max="50000" step="500" value={form.monthly_bill} onChange={update} data-testid="quote-bill-input" />
                  </label>
                  <label className="wide">Usable roof area <output>{form.roof_area} sq ft</output>
                    <input type="range" name="roof_area" min="100" max="5000" step="50" value={form.roof_area} onChange={update} data-testid="quote-roof-input" />
                  </label>
                </div>
                <button className="button button-gold" disabled={loading} data-testid="quote-submit-button">{loading ? "Preparing…" : "Generate my quotation"} <ArrowRight size={16} /></button>
                <small className="privacy-note">Indicative pricing only. Final quotation follows a free site survey.</small>
              </form>
            ) : (
              <div className="quote-result-card" data-testid="quotation-summary">
                <CheckCircle2 className="quote-check" size={38} />
                <span className="eyebrow">Quotation reference {done.ref}</span>
                <h2>Your indicative quotation is ready.</h2>
                {done.saved
                  ? <p className="form-status" data-testid="quote-saved-status">Saved with our team — we will verify it against your roof and DISCOM before final pricing.</p>
                  : <p className="form-status" data-testid="quote-saved-status">{error}</p>}
                <div className="quote-summary-grid">
                  <div><small>Recommended system</small><b>{est.size} kW</b></div>
                  <div><small>Indicative project cost</small><b>{inr(est.cost)}</b></div>
                  <div><small>Indicative subsidy (PM Surya Ghar)</small><b>{inr(est.subsidy)}</b></div>
                  <div className="highlight"><small>Indicative amount payable</small><b>{inr(est.payable)}</b></div>
                </div>
                <div className="quote-meta">{form.name} · {form.district}, {form.state} · {form.property_type} · {form.roof_area} sq ft</div>
                <a className="button button-whatsapp" href={waLink(waText)} target="_blank" rel="noreferrer" data-testid="quote-whatsapp-button">
                  <MessageCircle size={18} /> Send to WhatsApp Business
                </a>
                <button className="quiet-button" onClick={() => setDone(null)} data-testid="quote-edit-button">Edit my details</button>
                <small className="privacy-note"><ShieldCheck size={13} /> Subsidy amounts are indicative central figures; exact eligibility is confirmed during the official application.</small>
              </div>
            )}
            <Reveal className="quote-side" delay={120}>
              <div className="quote-side-card">
                <BadgeIndianRupee />
                <h3>What happens next?</h3>
                <ol>
                  <li>Your request reaches our team instantly.</li>
                  <li>We call to schedule a free site survey.</li>
                  <li>You receive a final quotation with exact components, subsidy status and timelines.</li>
                </ol>
                <small>No advance payment is ever requested before a written quotation.</small>
              </div>
              <div className="quote-side-card muted">
                <h3>Why indicative?</h3>
                <p>Roof orientation, shading, structure and your DISCOM's process all affect final pricing. We would rather show you an honest range now and an exact number after the survey.</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
