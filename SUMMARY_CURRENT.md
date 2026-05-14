## Goal
- Redesign the Kaya.ge travel marketplace frontend to match the exact design and layout of the reference site (kaya-rent.vercel.app) and deploy to Vercel.

## Constraints & Preferences
- Strip and chatbot APIs should be ignored; focus solely on front-end design fidelity.
- The site must match the reference exactly: glass-morphism navbar, specific hero layout, chip slides, search bar, listing cards with price tags, two-column Muse section, minimal footer.
- Georgian (primary), English (secondary), Russian (Phase 2) language support with full UTF-8.
- Phase 1 delivered before marketing/sales outreach.
- Revenue model: 20 GEL/month subscription (launch), B2B e-commerce (Phase 2), digital agency (Phase 2).

## Progress
### Done
- Analyzed reference site HTML/CSS to extract exact component structure, class names, icon SVGs, and layout patterns.
- Rewrote page.tsx with matching HTML structure: glass-nav bar inline, hero with background image and chips, search bar form, listing card grid, two-column Muse section, inline footer.
- Completely rewrote app/globals.css to match the reference CSS exactly: --peach/--ink color palette, Cormorant Garamond + Manrope fonts, glassmorphism nav bar, hero gradient + mist overlay, search bar with backdrop blur, listing cards with hover scale, muse grid, responsive breakpoints.
- Removed unused imports (styles from page.module.css, Navbar, Footer, useState, useEffect) from page.tsx and Supabase client code.
- Reference CSS (~43KB at /_next/static/css/217a2f3d2abed006.css) fully extracted into the local globals.css.
- Added font fallbacks (,serif after --font-display; ,system-ui,sans-serif after --font-body) to match reference CSS exactly.
- Built with next build (no TypeScript errors; SWC postcss warnings are unrelated to design changes).
- Committed and pushed all changes to the main branch; Vercel auto-deploy succeeded.
- Deployed at https://airbnb-56phctr0i-ahsas-projects-91179e36.vercel.app (Vercel staging) with production domain not yet set.

### In Progress
- (none; last deployment confirmed as match)

### Blocked
- SWC postcss plugin warnings on Windows ARM during build (not blocking deployment, warnings only).

## Key Decisions
- Switched from CSS Modules (page.module.css) to entirely global CSS (globals.css) for the homepage because the reference site uses a single global stylesheet and many components (hero, search-bar, nav) need shared classes across the page.
- Kept old Navbar.tsx/Footer.tsx components intact for other pages (search, hotels, apartments, dashboard, etc.) since they are imported by many routes; only the homepage now uses inline nav/footer markup with global CSS.
- Used exact hex colors, font stacks, border radii, and glass effect values from the reference (e.g., --peach: #ecc6a6, --ink: #1a120e, nav background `rgba(28,18,14,0.34)` with `backdrop-filter: blur(18px) saturate(120%)`).
- Deployed to Vercel using the existing project (prj_6vyMIQBhOodUhbEvpNvkOQivmYNB) without requiring a new project.

## Next Steps
1. Once design is approved, set the production domain and run a final cross-browser check.
2. After homepage sign-off, propagate the new global styles to other pages (search, hotels, etc.) by updating those components to use the same CSS classes.

## Critical Context
- The reference site (kaya-rent.vercel.app) is the design target; it runs Next.js 14 with CSS Modules but exports a single global CSS bundle at /_next/static/css/217a2f3d2abed006.css.
- Global CSS variables are defined in globals.css: --peach, --peach-soft, --peach-deep, --ink, --ink-soft, --muted, --line, --glass, --glass-strong, --shadow, --page-width, --font-display, --font-body.
- Site background: `radial-gradient(circle at top, rgba(255,232,208,.85), transparent 38%), linear-gradient(180deg, #f2d3bb 0, var(--peach) 30%, #f0ceb0 100%)`.
- Fixed navbar at top viewport (54px from top) with `position: fixed; transform: translateX(-50%)` and glass effect.
- Hero chip images are hardcoded Unsplash URLs; linting warnings only occur when images serve as image sources in `next/image`, not in CSS `background-image`.
- SWC postcss plugin warning: `"@next/swc-win32-arm64-msvc" isn't a directory or doesn't contain a package.json` — this is a known Next.js 14 issue on Windows ARM and does not affect the build output.

## Relevant Files
- app/globals.css: fully rewritten to reproduce reference site CSS (all component classes, glass effects, responsive).
- app/page.tsx: rewritten to use only global CSS classes; no module imports; inline nav, hero, search, cards, muse, footer.
- app/page.module.css: still exists but is no longer imported by any updated file; can be deleted after confirming no other file depends on it.
- app/components/Navbar.tsx + Navbar.module.css: unchanged; still used by other pages (search, hotels, etc.).
- app/components/Footer.tsx: unchanged; still used by other pages.
- app/search/page.tsx: cleaned up earlier (duplicate SearchContent removed).
- app/api/auth/login/route.ts, register/route.ts, bookings/route.ts, listings/route.ts, listings/[id]/route.ts: fixed to use NEXT_PUBLIC_SUPABASE_ANON_KEY and lazy client init.
- package.json: next-auth@4.24.11, stripe-js@7.x.
- vercel.json: installCommand with --legacy-peer-deps.
- next.config.mjs: eslint.ignoreDuringBuilds: true, images.remotePatterns for unsplash.
