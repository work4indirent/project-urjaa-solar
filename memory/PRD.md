# URJAA Solar Energy Platform PRD

## Original problem statement
Production-grade solar EPC platform for URJAA SOLAR ENERGY (Kunda, Pratapgarh, UP): premium minimal public website, Supabase (Postgres/Auth/RLS) business backend, admin CRM, quotations with WhatsApp handoff, service management. No fabricated business facts; unverified content labeled indicative/demo.

## Verified company facts (from GST certificate PDF)
- Legal/trade name: M/S URJAA SOLAR ENERGY (one "R" — brand corrected site-wide per user)
- Proprietor: Abhishek Jaiprakash Jaiswal · Constitution: Proprietorship
- GSTIN: 09AYYPJ2449J1ZN · Registered: Lucknow Allahabad Road, Near Jaishwaal Guest House, Kabariyaganj, Kunda, Pratapgarh, Uttar Pradesh
- WhatsApp Business: 9867405251 · Support email: Urjaasolarenergy@gmail.com
- Logo: user-uploaded, served locally at /app/frontend/public/urjaa-logo.jpeg

## Architecture
- React CRA/CRACO frontend talks DIRECTLY to Supabase via anon key (no service-role key anywhere). FastAPI/Mongo backend is legacy/unused for business flows.
- Migration /app/supabase/migrations/002_urjaa_platform.sql — APPLIED by user in Supabase dashboard (2026-06). Tables: profiles(role enum), leads, products, projects, subsidy_programs, quotations, quotation_items, service_requests, site_settings. RLS: anon insert-only on leads/quotations/service_requests; public read of published products/projects/subsidies; staff (admin/staff role) full CRUD via is_staff() security-definer fn.
- Auth: Supabase email/password; handle_new_user trigger auto-provisions profiles and auto-promotes urjaasolarenergy@gmail.com to admin. Email confirmation DISABLED in project.
- Key files: src/App.js (routes), src/lib/{supabase,db,company,geo}.js, src/context/AuthContext.js, src/components/Reveal.jsx (scroll animations), src/components/site/{Header,Footer}.jsx, src/pages/{Home,Listing,Contact,Quotation,Customer}.jsx, src/pages/admin/{AdminLayout,Dashboard,Manage,Quotations}.jsx + configs.js.
- Theme from logo: navy #0e2a5e, green #1f9d3a, gold #f0a400 (CSS vars in App.css).

## Implemented — 2026-06 (this session)
- Rebrand URRJAA→URJAA everywhere; real logo in header/footer/admin/favicon; logo color theme.
- Footer/About/Contact show verified GST details, WhatsApp Business 9867405251, support email.
- Homepage additions: PM Surya Ghar indicative subsidy tiers (₹30k/₹60k/₹78k central, labeled indicative), how-on-grid-works steps, FAQ accordion, scroll-reveal animations (IntersectionObserver, reduced-motion safe).
- Public quotation flow /quotation: state dropdown (all 36 states/UTs), district dropdown for 13 major states + free-text fallback, sliders, indicative estimate (size/cost/subsidy/payable), saves to Supabase, then "Send to WhatsApp Business" button with prefilled quote text → wa.me/919867405251.
- Admin CRM /admin (Supabase auth, role-guarded): Dashboard (KPIs + recharts leads-by-status), Leads (status pipeline CRUD), Quotations (expandable cards, status, WhatsApp-customer link, Print/PDF with GST letterhead), Products/Projects/Subsidies/Services via generic Manage drawer CRUD.
- Published products/projects render on public pages from Supabase.
- Customer portal placeholder retained at /customer (sign-in only, by design).
- Testing: curl RLS/auth verification + testing agent iteration_2 — 100% frontend flows pass.

## Implemented — 2026-06 (portal/media/settings batch — migration 003 APPLIED & E2E verified)
- Migration /app/supabase/migrations/003_urjaa_portal_media.sql APPLIED by user. Adds: products/projects image_url; customers table with profile_id auto-link trigger (matches auth signup email → customer record); customer_id FKs on quotations/projects/service_requests; RLS ownership policies (customer sees only own records via customers.profile_id = auth.uid()); site_settings public read; storage buckets products+projects (public read, staff-only write via is_staff()).
- Staff photo uploads: admin Products/Projects Manage drawer uploads to Supabase Storage → public URL; thumbnails in admin table; images render on public catalogue + product detail. (src/lib/db.js uploadImage, Manage.jsx image field.)
- Admin Customers screen: add customer by email/phone → portal auto-activates on customer signup with same email. RLS confirmed: customer sees ONLY their linked quotations/projects/services.
- Customer portal /customer: sign-in/up, activated portal shows quotations, project progress bars, service tickets; portal-not-active state with WhatsApp activation CTA.
- Public catalogue /products (grid) + /products/:id detail page (spec table, quote + WhatsApp CTAs). /projects catalogue.
- Admin Settings /admin/settings: edit calculator pricing & subsidy assumptions (site_settings 'calculator'); public calculator + quotations read live values via useCalcSettings hook. No code changes needed to adjust pricing.
- Fixed: Manage.jsx customer dropdown refetches on drawer open (was empty if opened before mount fetch resolved).
- Testing: iteration_3.json — 100% of new-feature flows pass (uploads, settings save+reflect, customer RLS ownership, product detail, WhatsApp link).

## Earlier (previous session)
Public homepage foundation, calculator, lead form, hero fallback, responsive nav.

## Prioritized backlog
- P1: CRA/CRACO/JS → Vite+TS+CSS Modules migration (original arch request, still unmet). Confirm with user if CRA acceptable.
- P1: Replace generated product images with company-owned/licensed assets when available.
- P1: Public service-request form feeding service_requests (admin screen + anon insert policy already exist).
- P2: 3D cinematic hero (R3F), SEO sitemap/JSON-LD, blog/FAQ CMS, quotation_items line-item editor, dedicated solutions detail pages.
- P2 (hardening from code review): client-side file size/MIME guard on uploads; range validation on Settings (savings_factor 0-1); ProductDetail is_published filter; purge orphan storage objects on product delete.

## Notes / gotchas
- Never print Supabase keys; env in frontend/.env (REACT_APP_SUPABASE_*).
- Admin creds in /app/memory/test_credentials.md.
- Test rows left in DB by tester: TEST_Lead_*, TEST_Quote_* (purge via admin UI if desired).
- All pricing/subsidy figures are labeled indicative by explicit user requirement — not a bug.
