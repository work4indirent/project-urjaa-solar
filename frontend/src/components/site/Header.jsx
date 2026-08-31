import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { COMPANY } from "@/lib/company";

const nav = ["Solutions", "Products", "Projects", "About", "Resources", "Contact"];

export function Brand({ testId = "brand-link" }) {
  return (
    <Link className="brand" to="/" data-testid={testId}>
      <img src={COMPANY.logo} alt="URJAA Solar Energy logo" />
      <span>URJAA <small>SOLAR ENERGY</small></span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header" data-testid="site-header">
      <Brand />
      <nav className={open ? "main-nav open" : "main-nav"} data-testid="main-navigation">
        {nav.map((n) => (
          <NavLink key={n} to={`/${n.toLowerCase()}`} data-testid={`nav-${n.toLowerCase()}`} onClick={() => setOpen(false)}>{n}</NavLink>
        ))}
        <Link className="mobile-cta" to="/quotation" onClick={() => setOpen(false)}>Get quotation <ArrowRight size={16} /></Link>
      </nav>
      <div className="header-actions">
        <a href={`tel:+${COMPANY.whatsapp}`} data-testid="header-call-link"><Phone size={17} /></a>
        <Link className="header-cta" to="/quotation" data-testid="header-quotation-link">Get quotation <ArrowRight size={16} /></Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Menu" data-testid="mobile-menu-button">{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}
