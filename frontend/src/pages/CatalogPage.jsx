import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ImageOff } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/Reveal";
import { listRows } from "@/lib/db";
import { inr } from "@/lib/company";

const emptyCopy = {
  products: "Our catalogue is being prepared. Every listed component is verified before publication — nothing is shown here that we cannot stand behind.",
  projects: "We are preparing this space for real URJAA installations. No invented locations, capacities or savings appear here.",
};

export default function CatalogPage({ kind, eyebrow, title, copy }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let alive = true;
    setRows(null); setErr("");
    listRows(kind).then(({ data, error }) => {
      if (!alive) return;
      if (error) setErr(error.message);
      setRows(data || []);
    });
    return () => { alive = false; };
  }, [kind]);
  const isProducts = kind === "products";
  return (
    <>
      <Header />
      <main className="page-main">
        <div className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{copy}</p></div></div>
        <section className="section">
          <div className="container">
            {err && <div className="catalog-empty" data-testid={`${kind}-error`}>Could not load: {err}</div>}
            {rows === null ? (
              <div className="catalog-empty" data-testid={`${kind}-loading`}>Loading…</div>
            ) : rows.length === 0 ? (
              <div className="catalog-empty" data-testid={`${kind}-empty`}>{emptyCopy[kind]}</div>
            ) : (
              <div className="catalog-grid" data-testid={`${kind}-grid`}>
                {rows.map((r, i) => {
                  const inner = (
                    <>
                      <div className="catalog-image">
                        {r.image_url ? <img src={r.image_url} alt={r.name} loading="lazy" /> : <span className="catalog-noimg"><ImageOff /></span>}
                        <span className="tag">{isProducts ? r.category : r.system_type || "Project"}</span>
                      </div>
                      <div className="catalog-body">
                        <h2>{r.name}</h2>
                        <p>{isProducts
                          ? [r.brand, r.capacity, r.warranty && `${r.warranty} warranty`].filter(Boolean).join(" · ") || r.description
                          : [r.location, r.capacity && `${r.capacity} kW`].filter(Boolean).join(" · ") || r.description}</p>
                        <div className="catalog-foot">
                          <b>{isProducts ? (r.price ? inr(r.price) : "Price on request") : (r.status || "").replace("_", " ")}</b>
                          {isProducts && <span className="text-button dark-text">Details <ArrowRight size={14} /></span>}
                        </div>
                      </div>
                    </>
                  );
                  return isProducts ? (
                    <Reveal key={r.id} delay={(i % 3) * 80}>
                      <Link className="catalog-card" to={`/products/${r.id}`} data-testid={`catalog-item-${i + 1}`}>{inner}</Link>
                    </Reveal>
                  ) : (
                    <Reveal className="catalog-card static" key={r.id} delay={(i % 3) * 80} data-testid={`catalog-item-${i + 1}`}>{inner}</Reveal>
                  );
                })}
              </div>
            )}
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
