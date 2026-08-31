# URRJAA Solar Energy Platform PRD
## Original problem statement
Build a production-grade full-stack solar website and business platform for URRJAA SOLAR ENERGY with premium public UX, Supabase Auth/Storage/Postgres, leads, admin, customer portal, quotations and service management.
## Architecture decisions
- React scaffold retained; browser uses only the Supabase anon key.
- Route-level public pages and reusable calculator, form, auth and listing components.
- SQL migration provides UUID entities, Auth profile trigger, RLS and storage buckets.
- No invented company metrics, projects, testimonials, certifications or product specifications.
## Personas
Solar prospects, Urrjaa sales/project staff, existing customers, and content managers.
## Implemented — 2026-02-14
- Premium responsive homepage with supplied logo, static cinematic hero, energy HUD, trust bar, calculator, solutions, process and CTA.
- Solutions/products/projects/about/resources/contact pages with realistic verified-content messaging.
- Connected Supabase lead form and Auth pages at `/admin` and `/customer`.
- SQL/RLS/storage migration at `supabase/migrations/001_urrjaa_core.sql`.
## Prioritized backlog
- P0: Run SQL migration; verify Auth email settings and storage policies.
- P0: Replace development phone number and add verified company content.
- P1: Add authenticated admin CRUD for leads, products, projects, subsidies and quotations.
- P1: Add customer milestones, signed documents, service tickets and printable quotes.
- P2: Add approved 3D/GLB hero, sourced subsidy CMS, analytics, sitemap and schema markup.