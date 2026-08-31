import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, waLink } from "@/lib/company";
import { Brand } from "@/components/site/Header";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Brand testId="footer-brand-link" />
          <p>Engineering a more useful relationship with the sun.</p>
          <div className="footer-legal" data-testid="footer-gst-details">
            <span><b>{COMPANY.legalName}</b></span>
            <span>Proprietor: {COMPANY.proprietor}</span>
            <span>GSTIN: {COMPANY.gstin}</span>
          </div>
        </div>
        <div>
          <b>Explore</b>
          <Link to="/solutions">Solutions</Link>
          <Link to="/products">Products</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/quotation">Get a quotation</Link>
        </div>
        <div>
          <b>Connect</b>
          <a href={`tel:+${COMPANY.whatsapp}`} data-testid="footer-phone">{COMPANY.phoneDisplay}</a>
          <a href={waLink("Hi URJAA Solar Energy, I would like to know more about rooftop solar.")} target="_blank" rel="noreferrer" data-testid="footer-whatsapp">WhatsApp Business</a>
          <a href={`mailto:${COMPANY.email}`} data-testid="footer-email"><Mail size={13} /> {COMPANY.email}</a>
        </div>
        <div>
          <b>Registered office</b>
          <span className="footer-address"><MapPin size={13} /> {COMPANY.address}</span>
          <a href={`tel:+${COMPANY.whatsapp}`}><Phone size={13} /> Call our team</a>
        </div>
      </div>
      <div className="container footer-bottom">
        © {new Date().getFullYear()} {COMPANY.legalName} <span>GSTIN {COMPANY.gstin} · Kunda, Pratapgarh, Uttar Pradesh</span>
      </div>
    </footer>
  );
}
