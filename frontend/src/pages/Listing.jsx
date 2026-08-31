import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/Reveal";
import { listRows } from "@/lib/db";
import { COMPANY } from "@/lib/company";

const staticData = {
  solutions: [["Residential solar", "Homes", "Right-sized rooftop systems that prioritize bill reduction, safety and a clean installation."], ["Commercial solar", "Businesses", "Offset daytime demand with a system designed around your load profile."], ["Hybrid & backup", "Continuity", "Pair generation with storage when your power needs extend beyond the grid."], ["Agricultural solar", "On the land", "Explore solar for pumps and rural loads with careful attention to access and maintenance."], ["Institutional solar", "Shared spaces", "Measured, documented energy planning for schools, clinics and community facilities."], ["Solar EPC", "End to end", "A single accountable partner from feasibility and design through commissioning."]],
  products: [["Solar panels", "Panels", "A considered shortlist based on efficiency, warranty, roof conditions and verified availability."], ["Inverters & hybrid systems", "Power electronics", "The control centre of your system, specified for the way your building consumes energy."], ["Batteries", "Storage", "Storage options for resilience and time-shifting — recommended only where the use case makes sense."], ["Mounting & protection", "Balance of system", "Structures, DCDB/ACDB and cables that keep the installation safe and serviceable."]],
  projects: [["Project library in progress", "Verified case studies", "We are preparing this space for real URJAA installations. No invented locations, capacities or savings appear here."], ["Share your site story", "Customer collaboration", "Once a project is commissioned and approved for publication, we will document the design decisions and outcomes."]],
  about: [["A proprietorship with a clear point of view", "Who we are", `${COMPANY.legalName} is a GST-registered solar business (GSTIN ${COMPANY.gstin}) led by proprietor ${COMPANY.proprietor}, based at Kunda, Pratapgarh, Uttar Pradesh.`], ["Verified information first", "How we communicate", "We publish only what we can stand behind. Certifications, case studies and metrics appear here as they are verified — never before."], ["Reach us directly", "Always available", `WhatsApp Business ${COMPANY.phoneDisplay} · ${COMPANY.email}`]],
};

export default function Listing({ kind, title, eyebrow, copy, table, mapRow }) {
  const [rows, setRows] = useState(null);
  useEffect(() => {
    let alive = true;
    if (table) listRows(table).then(({ data }) => { if (alive && data?.length) setRows(data.map(mapRow)); });
    return () => { alive = false; };
  }, [table, mapRow]);
  const items = rows || staticData[kind];
  return (
    <>
      <Header />
      <main className="page-main">
        <div className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></div>
        <section className="section">
          <div className="container listing-grid">
            {items.map(([t, tag, c], i) => (
              <Reveal as="article" className="listing-item" key={`${t}-${i}`} delay={i * 70} data-testid={`listing-item-${i + 1}`}>
                <span className="listing-index">{String(i + 1).padStart(2, "0")}</span>
                <div><h2>{t}</h2><p>{c}</p><span className="tag">{tag}</span></div>
                <ArrowRight />
              </Reveal>
            ))}
          </div>
        </section>
        <section className="slim-cta">
          <div className="container">
            <h2>Want a recommendation that fits your site?</h2>
            <Link className="button button-dark" to="/quotation" data-testid="listing-quotation-button">Get your quotation <ArrowRight size={16} /></Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
