# CLAUDE.md — Kaya.ge Platform Architecture & Skills Reference

## 🚀 Project Overview
**Kaya.ge** is an all-in-one travel and services marketplace for Georgia (Sakartvelo) built with **Next.js 14 App Router**, featuring:
- Airbnb-style stays (hotels, apartments, guesthouses, mountain cabins, wine villas)
- Double-booking prevention
- Local database (`data/kaya-db.json`) with seamless cloud MongoDB fallback
- Simple authentication (Tourist, Business Host, Administrator)
- Built-in Affiliate / Referral tracking system
- Georgian cultural experiences, food & dining, tours, car rentals, and AI Concierge (KLARA)

---

## 🎨 UI/UX & Design System Tokens

### 1. Typography
- **Display Font**: `Cormorant Garamond` (`var(--font-display)`) — Used for titles, hero statements, logo text.
- **Body Font**: `Manrope` (`var(--font-body)`) — Weights 400 to 800 for interface, inputs, cards, metadata.

### 2. Core Color Palette
- `--ink`: `#241712` (deep warm espresso)
- `--ink-soft`: `rgba(36, 23, 18, 0.74)`
- `--muted`: `rgba(36, 23, 18, 0.55)`
- `--surface`: `#fff7ef` (warm cream)
- `--surface-warm`: `#f8e2cb` (warm terracotta peach)
- `--card-bg`: `rgba(255, 252, 248, 0.92)`
- `--accent`: `#d9653b` (Warm Georgian terracotta orange / clay qvevri)
- `--accent-soft`: `#e88c5d` (Light terracotta)
- `--accent-deep`: `#be4f27` (Deep amber clay)
- `--sand`: `#e5b287` (Warm sand)
- `--sand-gold`: `#d4a373` (Amber gold)
- `--success`: `#2c9d6f`
- `--warning`: `#e58c55`
- `--error`: `#d04a3b`

### 3. Dark Theme Tokens (`html[data-theme="dark"]`)
- `--surface`: `#1a120e`
- `--surface-warm`: `#150e0a`
- `--card-bg`: `rgba(28, 21, 17, 0.88)`
- `--border`: `hsla(0, 0%, 100%, 0.08)`

---

## 🛠️ Installed Skills & Capabilities (`.agents/skills/`)

### 1. `ui-ux-pro-max`
- 79 searchable design styles, 192 product palettes, 74 font pairings, 119 UX guidelines.
- Motion presets, accessibility requirements, responsive layout patterns.

### 2. `ui-styling`
- Clean utility styling, accessible dialogs, dropdowns, inputs, forms, and glass cards.

### 3. `design-system`
- 3-tier token architecture (primitive → semantic → component).
- CSS variable scales, spacing units, and radius tokens (`--radius-sm: 12px`, `--radius-lg: 22px`, `--radius-xl: 28px`).

### 4. `design` & `brand`
- Georgian brand identity guidelines, visual harmony, logo specifications.

### 5. `banner-design` & `slides`
- HTML presentations, social banners, and marketing mockups.

### 6. `ui-skills` & `aesthetic-frontend-skills`
- CLI discovery tools for components and animations:
  ```bash
  # Explore UI skill categories
  npx ui-skills categories
  npx ui-skills list --category motion
  npx ui-skills get baseline-ui

  # Install community aesthetic frontend skills
  npx skills add alexiseverage/aesthetic-frontend-skills
  ```

---

## 🗄️ Database & Storage Architecture

### Dual-Engine Database (`lib/mongodb.ts` + `lib/local-db.ts`)
The application works in two modes automatically:
1. **Local File Database (`data/kaya-db.json`)**:
   - Zero setup required. Runs locally or in serverless without MongoDB server.
   - Stores `users`, `listings`, `bookings`, `affiliates`.
2. **MongoDB Atlas / Cloud**:
   - When `MONGODB_URI` environment variable is available and reachable, connects automatically.

### Pre-Seeded Default Accounts:
- **Admin**: `admin@kaya.ge` / `admin123` (or `ahsanstarn@gmail.com`)
- **Business Host**: `host@kaya.ge` / `host123`
- **Tourist**: `tourist@kaya.ge` / `tourist123`

---

## 🧭 Key Routes & Pages

- **Homepage**: `/` (hero carousel, search, featured offers)
- **Stays / Hotels**: `/hotels`
- **Apartments**: `/apartments`
- **Search**: `/search` (filtered by city, type, price, rating)
- **Listing Details**: `/listing/[id]` (photos, amenities, reserve widget)
- **Tourist Dashboard**: `/dashboard` (active bookings, referral code)
- **Business Host Portal**: `/business/dashboard` (my listings, create property modal, incoming bookings)
- **Affiliate Program**: `/dashboard/affiliates` (unique referral link, stats)
- **Admin Panel**: `/admin` (platform analytics, property moderation, user management)
- **AI Concierge**: `/klara` (Georgian travel intelligence)

---

## ⚡ Development & Deployment Commands

```bash
# Run locally
npm run dev

# Production build test
npm run build

# Deploy to Vercel
npx vercel --prod --yes
```
