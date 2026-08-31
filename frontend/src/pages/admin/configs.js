import { inr } from "@/lib/company";

const LEAD_STATUSES = ["new", "contacted", "qualified", "site_survey", "quotation_sent", "negotiation", "won", "lost", "follow_up"];

export const leadsConfig = {
  table: "leads",
  title: "Leads",
  subtitle: "Enquiries from the website lead form and manual entries.",
  statusField: "status",
  statusOptions: LEAD_STATUSES,
  columns: [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "solution", label: "Interest" },
    { key: "monthly_bill", label: "Bill" },
    { key: "created_at", label: "Received", render: (r) => new Date(r.created_at).toLocaleDateString("en-IN") },
  ],
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "email", label: "Email" },
    { name: "city", label: "City" },
    { name: "property_type", label: "Property type", type: "select", options: ["Home", "Business", "Institution", "Farm"] },
    { name: "monthly_bill", label: "Monthly bill" },
    { name: "solution", label: "Solution interest", type: "select", options: ["Residential", "Commercial", "Hybrid & backup", "Solar pump", "Not sure yet"] },
    { name: "message", label: "Message", type: "textarea" },
    { name: "notes", label: "Internal notes", type: "textarea" },
  ],
};

export const productsConfig = {
  table: "products",
  title: "Products",
  subtitle: "Catalogue shown on the public products page when published.",
  statusField: null,
  bucket: "products",
  columns: [
    { key: "image_url", label: "Photo", render: (r) => (r.image_url ? <img className="table-thumb" src={r.image_url} alt="" /> : "—") },
    { key: "name", label: "Name" },
    { key: "brand", label: "Brand" },
    { key: "category", label: "Category" },
    { key: "capacity", label: "Capacity" },
    { key: "price", label: "Price", render: (r) => (r.price ? inr(r.price) : "—") },
    { key: "is_published", label: "Published", render: (r) => (r.is_published ? "Yes" : "No") },
  ],
  fields: [
    { name: "name", label: "Name", required: true },
    { name: "image_url", label: "Product photo", type: "image" },
    { name: "brand", label: "Brand" },
    { name: "category", label: "Category", type: "select", options: ["Solar Panels", "Inverters", "Batteries", "Mounting & Protection", "Accessories"] },
    { name: "capacity", label: "Capacity / Rating" },
    { name: "warranty", label: "Warranty" },
    { name: "price", label: "Price (₹)", type: "number" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "is_published", label: "Published on website", type: "checkbox" },
  ],
};

export const projectsConfig = {
  table: "projects",
  title: "Projects",
  subtitle: "Installations and case studies. Published ones appear on the website.",
  statusField: "status",
  statusOptions: ["planned", "survey", "in_progress", "commissioned", "closed"],
  bucket: "projects",
  columns: [
    { key: "image_url", label: "Photo", render: (r) => (r.image_url ? <img className="table-thumb" src={r.image_url} alt="" /> : "—") },
    { key: "name", label: "Name" },
    { key: "location", label: "Location" },
    { key: "capacity", label: "Capacity" },
    { key: "system_type", label: "Type" },
    { key: "is_published", label: "Published", render: (r) => (r.is_published ? "Yes" : "No") },
  ],
  fields: [
    { name: "name", label: "Project name", required: true },
    { name: "image_url", label: "Project photo", type: "image" },
    { name: "customer_id", label: "Linked customer (for portal)", type: "customer" },
    { name: "location", label: "Location" },
    { name: "state", label: "State" },
    { name: "district", label: "District" },
    { name: "capacity", label: "Capacity (kW)" },
    { name: "system_type", label: "System type", type: "select", options: ["On-grid", "Off-grid", "Hybrid", "Solar pump"] },
    { name: "description", label: "Description", type: "textarea" },
    { name: "is_published", label: "Published on website", type: "checkbox" },
  ],
};

export const subsidiesConfig = {
  table: "subsidy_programs",
  title: "Subsidy programs",
  subtitle: "Only verified programs should be marked published.",
  statusField: "status",
  statusOptions: ["draft", "published", "archived"],
  columns: [
    { key: "program_name", label: "Program" },
    { key: "state", label: "State" },
    { key: "benefit", label: "Benefit" },
    { key: "last_verified_at", label: "Last verified" },
  ],
  fields: [
    { name: "program_name", label: "Program name", required: true },
    { name: "state", label: "State (blank = central)" },
    { name: "benefit", label: "Benefit summary" },
    { name: "eligibility", label: "Eligibility", type: "textarea" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "official_source", label: "Official source URL" },
    { name: "last_verified_at", label: "Last verified on", type: "date" },
  ],
};

export const servicesConfig = {
  table: "service_requests",
  title: "Service requests",
  subtitle: "After-sales tickets: cleaning, repairs, monitoring issues and AMC.",
  statusField: "status",
  statusOptions: ["open", "scheduled", "in_progress", "resolved", "closed"],
  columns: [
    { key: "name", label: "Customer" },
    { key: "phone", label: "Phone" },
    { key: "service_type", label: "Type" },
    { key: "city", label: "City" },
    { key: "created_at", label: "Raised", render: (r) => new Date(r.created_at).toLocaleDateString("en-IN") },
  ],
  fields: [
    { name: "name", label: "Customer name", required: true },
    { name: "phone", label: "Phone", required: true },
    { name: "email", label: "Email" },
    { name: "city", label: "City" },
    { name: "customer_id", label: "Linked customer (for portal)", type: "customer" },
    { name: "service_type", label: "Service type", type: "select", options: ["Panel cleaning", "Inverter issue", "Generation drop", "Net metering", "AMC visit", "Other"] },
    { name: "description", label: "Description", type: "textarea" },
    { name: "notes", label: "Internal notes", type: "textarea" },
  ],
};

export const customersConfig = {
  table: "customers",
  title: "Customers",
  subtitle: "Add a customer's email or phone here to activate their portal. When they sign up at /customer with the same email, their portal opens automatically with everything you've linked to them.",
  statusField: null,
  columns: [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "profile_id", label: "Portal", render: (r) => (r.profile_id ? "✓ Active" : "Awaiting sign-up") },
    { key: "created_at", label: "Added", render: (r) => new Date(r.created_at).toLocaleDateString("en-IN") },
  ],
  fields: [
    { name: "name", label: "Customer name", required: true },
    { name: "email", label: "Email (used to match their portal login)" },
    { name: "phone", label: "Phone" },
    { name: "notes", label: "Internal notes", type: "textarea" },
  ],
};
