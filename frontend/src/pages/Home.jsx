import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BadgeIndianRupee, BatteryCharging, BarChart3, ChevronDown, ChevronRight, FileCheck, Gauge, House, Landmark, Leaf, PlugZap, ShieldCheck, Sun, Zap } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/Reveal";
import { COMPANY, centralSubsidy, inr, waLink } from "@/lib/company";

const heroImage = "https://images.pexels.com/photos/38928940/pexels-photo-38928940.jpeg?auto=compress&cs=tinysrgb&w=1800";

function Intro({ eyebrow, title, copy }) {
  return (
    <div className="section-intro">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function Hero() {
  const go = useNavigate();
  return (
    <section className="hero" data-testid="hero-section">
      <div className="hero-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(8,17,38,.94),rgba(8,17,38,.55),rgba(8,17,38,.12)),url(${heroImage})` }} />
      <div className="hero-grid" />
      <div className="hero-content">
        <span className="eyebrow hero-eyebrow"><i /> Solar, designed around your life</span>
        <h1>Turn sunlight into <em>everyday independence.</em></h1>
        <p>Thoughtful rooftop solar systems for Indian homes, businesses and institutions — engineered for the years ahead.</p>
        <div className="hero-actions">
          <button className="button button-gold" onClick={() => go("/quotation")} data-testid="hero-quotation-button">Get your quotation <ArrowRight size={18} /></button>
          <button className="text-button" onClick={() => document.getElementById("calculator").scrollIntoView({ behavior: "smooth" })} data-testid="hero-calculator-button">Calculate your savings <ChevronRight size={17} /></button>
        </div>
        <div className="hero-note"><ShieldCheck size={16} /> Transparent estimates. Final pricing follows a site survey.</div>
      </div>
      <div className="energy-hud" data-testid="hero-energy-hud">
        <div className="hud-label">LIVE PREVIEW <i /></div>
        <div className="hud-path"><span><Sun />Sun</span><b /> <span><Zap />Panels</span><b /><span><House />Home</span></div>
        <div className="hud-stats"><div><strong>4.82</strong><small>kW example system</small></div><div><strong>18.6</strong><small>kWh example day</small></div></div>
        <small className="demo-label">Development preview values</small>
      </div>
      <div className="hero-scroll">Scroll to explore <i /></div>
    </section>
  );
}

function Calculator() {
  const [bill, setBill] = useState(4500), [roof, setRoof] = useState(600), [type, setType] = useState("Home");
  const r = useMemo(() => {
    const size = Math.max(1, Math.min(20, Math.round(bill / 85) / 10)), gen = Math.round(size * 1450), annual = Math.round(bill * 12 * 0.82), cost = Math.round(size * 52000);
    return { size, gen, annual, cost, pay: (cost / annual).toFixed(1) };
  }, [bill]);
  return (
    <section className="section calculator-section" id="calculator" data-testid="calculator-section">
      <div className="container calc-layout">
        <Reveal>
          <Intro eyebrow="Your first estimate" title="See what your roof could do." copy="A planning estimate, not a sales promise. Adjust the inputs, then request a quotation for a site-specific design." />
          <div className="assumption-note"><ShieldCheck size={16} /> Uses editable planning assumptions. Subsidy and final pricing are confirmed separately.</div>
          <div className="calc-fields">
            <label>Monthly electricity bill <output>₹{bill.toLocaleString("en-IN")}</output>
              <input type="range" min="1000" max="30000" step="500" value={bill} onChange={(e) => setBill(+e.target.value)} data-testid="monthly-bill-input" />
            </label>
            <label>Usable roof area <output>{roof} sq ft</output>
              <input type="range" min="200" max="3000" step="50" value={roof} onChange={(e) => setRoof(+e.target.value)} data-testid="roof-area-input" />
            </label>
            <label>Property type
              <select value={type} onChange={(e) => setType(e.target.value)} data-testid="property-type-select"><option>Home</option><option>Business</option><option>Institution</option></select>
            </label>
          </div>
        </Reveal>
        <Reveal className="calc-result" delay={120} data-testid="calculator-result">
          <span className="result-label">Indicative system design</span>
          <strong>{r.size.toFixed(1)} kW</strong>
          <small>based on your bill and roof input</small>
          <div className="result-grid">
            <div><small>Annual generation</small><b>{r.gen.toLocaleString("en-IN")} kWh</b></div>
            <div><small>Potential annual savings</small><b>₹{r.annual.toLocaleString("en-IN")}</b></div>
            <div><small>Illustrative project cost</small><b>₹{r.cost.toLocaleString("en-IN")}</b></div>
            <div><small>Simple payback</small><b>{r.pay} years</b></div>
          </div>
          <Link className="button button-gold" to="/quotation" data-testid="calculator-lead-button">Get site-specific quotation <ArrowRight size={16} /></Link>
          <small className="result-disclaimer">{type} · {roof} sq ft · illustrative only</small>
        </Reveal>
      </div>
    </section>
  );
}

const tiers = [
  { kw: "1 kW", fit: "Compact homes", subsidy: centralSubsidy(1) },
  { kw: "2 kW", fit: "Medium homes", subsidy: centralSubsidy(2) },
  { kw: "3 kW+", fit: "Larger homes & shops", subsidy: centralSubsidy(3), popular: true },
];

function Subsidy() {
  return (
    <section className="section subsidy-section" data-testid="subsidy-section">
      <div className="container">
        <Reveal>
          <Intro eyebrow="PM Surya Ghar: Muft Bijli Yojana" title="Government support can cover a large share of your system." copy="Indicative central subsidy amounts as published on pmsuryaghar.gov.in. Your exact eligibility and amount are confirmed during the official application, which we help you complete." />
        </Reveal>
        <div className="tier-grid">
          {tiers.map((t, i) => (
            <Reveal className={t.popular ? "tier-card popular" : "tier-card"} key={t.kw} delay={i * 100} data-testid={`subsidy-tier-${i + 1}`}>
              {t.popular && <span className="tier-tag">Most common</span>}
              <h3>{t.kw}</h3>
              <small>{t.fit}</small>
              <div className="tier-amount"><span>Indicative central subsidy</span><strong>{inr(t.subsidy)}</strong></div>
              <Link className="text-button dark-text" to="/quotation">Check for your roof <ArrowRight size={15} /></Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="subsidy-notes" delay={150}>
          <div><FileCheck size={16} /> Documents usually needed: electricity bill, identity proof, bank details and roof ownership.</div>
          <div><Landmark size={16} /> State top-up schemes may apply in some states and are verified before your quotation is finalised.</div>
        </Reveal>
      </div>
    </section>
  );
}

const steps = [
  ["Panels", "Sunlight becomes DC power on your roof", Sun],
  ["Inverter", "DC is converted to usable AC power", PlugZap],
  ["Net meter", "Exports and imports are measured", Gauge],
  ["Home & grid", "Use what you need, feed back the rest", House],
];

function HowItWorks() {
  return (
    <section className="section how-section" data-testid="how-it-works-section">
      <div className="container">
        <Reveal>
          <Intro eyebrow="The technology" title="How an on-grid solar system works." copy="Four quiet steps between the sun and your switchboard." />
        </Reveal>
        <div className="how-line">
          {steps.map(([t, c, Icon], i) => (
            <Reveal className="how-step" key={t} delay={i * 110} data-testid={`how-step-${i + 1}`}>
              <span className="icon-square"><Icon /></span>
              <b>{i + 1}. {t}</b>
              <small>{c}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const solutions = [
  ["Residential", House, "A quieter, more predictable energy bill for the place you call home."],
  ["Commercial", BarChart3, "Make operating costs more resilient without interrupting business."],
  ["Hybrid & backup", BatteryCharging, "More control when the grid is unreliable or your work cannot stop."],
  ["Institutions", Leaf, "Purpose-built systems for schools, hospitals and community spaces."],
];

function Solutions() {
  return (
    <section className="section solutions-band">
      <div className="container">
        <Reveal>
          <Intro eyebrow="Where we work" title="Energy systems with a point of view." copy="We begin with how a space is used, then size the system around it. No one-size-fits-all proposals." />
        </Reveal>
        <div className="solution-grid">
          {solutions.map(([name, Icon, copy], i) => (
            <Reveal key={name} delay={i * 90}>
              <Link className="solution-item" to="/solutions" data-testid={`solution-${name.toLowerCase().replaceAll(" ", "-")}`}>
                <span className="icon-square"><Icon /></span>
                <h3>{name}</h3>
                <p>{copy}</p>
                <ArrowRight size={17} />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="section flow-section">
      <div className="container">
        <Reveal className="flow-copy">
          <Intro eyebrow="The URJAA method" title="Good solar is a process, not a product." copy="From the first bill review to long-term monitoring, every decision is documented and explained." />
          <Link className="text-button dark-text" to="/about" data-testid="method-link">How we work <ArrowRight size={17} /></Link>
        </Reveal>
        <div className="flow-line">
          {["Listen", "Survey", "Design", "Install", "Support"].map((s, i) => (
            <Reveal className="flow-step" key={s} delay={i * 100} data-testid={`process-step-${i + 1}`}>
              <span>0{i + 1}</span><b>{s}</b>
              <small>{["Understand your space", "Measure the real roof", "Model before we quote", "Install with care", "Stay accountable"][i]}</small>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const faqs = [
  ["How do I know what system size I need?", "Divide your monthly units by 30 for daily consumption, then by average sun hours (4–5 in most of North India). A household using 300 units a month typically needs around a 2–3 kW system. Our survey confirms the exact size."],
  ["What happens during a power cut?", "A standard on-grid system switches off for grid safety. If backup matters to you, we design a hybrid system with battery storage sized to the loads you actually need."],
  ["How much maintenance do panels need?", "Very little. Rinsing panels with water a few times a year and an annual professional check keeps output healthy. Dust left uncleaned can reduce generation noticeably in dry months."],
  ["How long does installation take?", "A typical residential rooftop installation takes a few days once material reaches site. Net metering and subsidy timelines depend on the DISCOM and are shared transparently in your quotation."],
  ["Is the subsidy really paid to me directly?", "Under PM Surya Ghar, the central subsidy is transferred to the applicant's bank account after commissioning and inspection. We assist with the portal application and documentation end to end."],
];

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section faq-section" data-testid="faq-section">
      <div className="container faq-layout">
        <Reveal>
          <Intro eyebrow="Honest answers" title="Questions we hear every week." copy="If yours isn't here, message us on WhatsApp — a real person replies." />
          <a className="button button-dark" href={waLink("Hi URJAA Solar Energy, I have a question about rooftop solar.")} target="_blank" rel="noreferrer" data-testid="faq-whatsapp-button">Ask on WhatsApp <ArrowRight size={16} /></a>
        </Reveal>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <Reveal className={open === i ? "faq-item open" : "faq-item"} key={q} delay={i * 60}>
              <button onClick={() => setOpen(open === i ? -1 : i)} data-testid={`faq-question-${i + 1}`}>{q} <ChevronDown size={17} /></button>
              {open === i && <p data-testid={`faq-answer-${i + 1}`}>{a}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <section className="trust-band" data-testid="trust-band">
          {["Engineering-led recommendations", "Clear scope before we quote", "Care beyond commissioning", `GST-registered: ${COMPANY.gstin}`].map((x, i) => (
            <div key={x}><strong>0{i + 1}</strong><span>{x}</span></div>
          ))}
        </section>
        <Calculator />
        <Subsidy />
        <HowItWorks />
        <Solutions />
        <Process />
        <Faq />
        <section className="closing-section">
          <div className="container closing-inner">
            <Reveal>
              <span className="eyebrow">Make the next unit count</span>
              <h2>The sun is already doing the work.<br /><em>Let's put it to use.</em></h2>
            </Reveal>
            <Reveal delay={120}>
              <Link className="button button-gold" to="/quotation" data-testid="closing-quotation-button"><BadgeIndianRupee size={17} /> Get your quotation</Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
