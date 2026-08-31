import { useState } from "react";
import { Phone, Send } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { createLead } from "@/lib/db";
import { COMPANY, waLink } from "@/lib/company";

function ContactForm() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", property_type: "Home", monthly_bill: "", solution: "Residential", message: "" });
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await createLead(form);
    setLoading(false);
    setStatus(error ? "We could not send that just now. Please call or WhatsApp us." : "Thanks — your enquiry is safely with our team. We'll be in touch after reviewing it.");
    if (!error) setForm({ ...form, name: "", phone: "", email: "", city: "", monthly_bill: "", message: "" });
  };
  return (
    <form className="lead-form" onSubmit={submit} data-testid="lead-form">
      <span className="eyebrow">Start a conversation</span>
      <h2>Let's design what's next.</h2>
      <p>No pressure, no inflated promises. Tell us a little about your space.</p>
      <div className="form-grid">
        {[["name", "Name", "Your name"], ["phone", "Phone", "10-digit number"], ["email", "Email", "you@company.com"], ["city", "City", "Where is the site?"], ["monthly_bill", "Monthly electricity bill", "₹ approximate"]].map(([n, l, ph]) => (
          <label key={n}>{l}
            <input required={n === "name" || n === "phone"} type={n === "email" ? "email" : "text"} name={n} value={form[n]} onChange={update} placeholder={ph} data-testid={`lead-${n}-input`} />
          </label>
        ))}
        <label>Property type
          <select name="property_type" value={form.property_type} onChange={update} data-testid="lead-property-select"><option>Home</option><option>Business</option><option>Institution</option><option>Farm</option></select>
        </label>
        <label className="wide">What can we help with?
          <select name="solution" value={form.solution} onChange={update} data-testid="lead-solution-select"><option>Residential</option><option>Commercial</option><option>Hybrid & backup</option><option>Solar pump</option><option>Not sure yet</option></select>
        </label>
        <label className="wide">A note for our team
          <textarea name="message" value={form.message} onChange={update} rows="3" placeholder="Anything we should know?" data-testid="lead-message-input" />
        </label>
      </div>
      <button className="button button-gold" disabled={loading} data-testid="lead-submit-button">{loading ? "Sending…" : "Send enquiry"} <Send size={16} /></button>
      {status && <p className="form-status" role="status" data-testid="lead-form-status">{status}</p>}
      <small className="privacy-note">Your details are used only to respond to this enquiry.</small>
    </form>
  );
}

export default function Contact() {
  return (
    <>
      <Header />
      <main className="contact-layout container">
        <div className="contact-copy">
          <span className="eyebrow">Contact URJAA</span>
          <h1>Start with the<br /><em>real questions.</em></h1>
          <p>Tell us where you are, what you are trying to power and what you want to understand. We'll take it from there.</p>
          <div className="contact-links">
            <a href={`tel:+${COMPANY.whatsapp}`} data-testid="contact-phone-link"><Phone /> Call our team <small>{COMPANY.phoneDisplay}</small></a>
            <a href={waLink("Hi URJAA Solar Energy, I would like to discuss a solar installation.")} target="_blank" rel="noreferrer" data-testid="contact-whatsapp-link"><Send /> WhatsApp Business <small>Usually the fastest route</small></a>
            <a href={`mailto:${COMPANY.email}`} data-testid="contact-email-link"><Send /> Email support <small>{COMPANY.email}</small></a>
          </div>
        </div>
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
