import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, MessageCircle, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/lib/supabase";
import { inr, waLink } from "@/lib/company";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(undefined);
  useEffect(() => {
    let alive = true;
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => { if (alive) setProduct(data || null); });
    return () => { alive = false; };
  }, [id]);
  return (
    <>
      <Header />
      <main className="page-main">
        <section className="section">
          <div className="container">
            <Link className="text-button dark-text back-link" to="/products" data-testid="product-back-link"><ArrowLeft size={15} /> All products</Link>
            {product === undefined ? null : product === null ? (
              <div className="catalog-empty" data-testid="product-not-found">This product is not available. It may have been unpublished.</div>
            ) : (
              <div className="product-detail" data-testid="product-detail">
                <div className="product-detail-image">
                  {product.image_url ? <img src={product.image_url} alt={product.name} /> : <div className="catalog-noimg tall" />}
                </div>
                <div className="product-detail-info">
                  <span className="eyebrow">{product.category}</span>
                  <h1>{product.name}</h1>
                  {product.description && <p className="product-desc">{product.description}</p>}
                  <table className="spec-table" data-testid="product-spec-table">
                    <tbody>
                      {[["Brand", product.brand], ["Capacity / Rating", product.capacity], ["Warranty", product.warranty], ["Price", product.price ? inr(product.price) : "On request — depends on system design"]].map(([k, v]) => v && (
                        <tr key={k}><th>{k}</th><td>{v}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="product-actions">
                    <Link className="button button-gold" to="/quotation" data-testid="product-quote-button">Get quotation with this <ArrowRight size={16} /></Link>
                    <a className="button button-whatsapp" href={waLink(`Hi URJAA Solar Energy, I'm interested in: ${product.name}. Please share details.`)} target="_blank" rel="noreferrer" data-testid="product-whatsapp-button"><MessageCircle size={16} /> Ask on WhatsApp</a>
                  </div>
                  <small className="privacy-note"><ShieldCheck size={13} /> Final component selection is confirmed in your written quotation after a site survey.</small>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
