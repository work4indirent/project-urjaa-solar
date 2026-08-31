import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/Home";
import Listing from "@/pages/Listing";
import CatalogPage from "@/pages/CatalogPage";
import ProductDetail from "@/pages/ProductDetail";
import Contact from "@/pages/Contact";
import Quotation from "@/pages/Quotation";
import Customer from "@/pages/Customer";
import AdminLayout from "@/pages/admin/AdminLayout";
import Dashboard from "@/pages/admin/Dashboard";
import Manage from "@/pages/admin/Manage";
import Quotations from "@/pages/admin/Quotations";
import SettingsPage from "@/pages/admin/SettingsPage";
import { customersConfig, leadsConfig, productsConfig, projectsConfig, servicesConfig, subsidiesConfig } from "@/pages/admin/configs";
import "@/App.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<Listing kind="solutions" eyebrow="Solutions" title="Solar that fits the way you live and work." copy="Different buildings, different loads, different reasons to switch. Start with the use case — not a catalogue." />} />
          <Route path="/products" element={<CatalogPage kind="products" eyebrow="Products" title="Components chosen for the whole system." copy="Every listed component is verified before publication. Final selection is matched to your design and confirmed in your quotation." />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/projects" element={<CatalogPage kind="projects" eyebrow="Projects" title="A case-study library built on permission and proof." copy="Real installations deserve real context. This collection grows as customers approve their stories." />} />
          <Route path="/about" element={<Listing kind="about" eyebrow="About URJAA" title="Make solar feel less complicated." copy="We ask what the building needs before recommending what it can buy. Verified company information is shared transparently." />} />
          <Route path="/resources" element={<Listing kind="products" eyebrow="Resources" title="Useful answers, without the noise." copy="A future home for practical guides, sourced subsidy updates and operating notes. Nothing is published as fact until verified." />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/quotation" element={<Quotation />} />
          <Route path="/customer" element={<Customer />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="leads" element={<Manage config={leadsConfig} />} />
            <Route path="quotations" element={<Quotations />} />
            <Route path="customers" element={<Manage config={customersConfig} />} />
            <Route path="products" element={<Manage config={productsConfig} />} />
            <Route path="projects" element={<Manage config={projectsConfig} />} />
            <Route path="subsidies" element={<Manage config={subsidiesConfig} />} />
            <Route path="services" element={<Manage config={servicesConfig} />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
