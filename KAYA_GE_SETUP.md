# KAYA.GE - Georgia's All-in-One Travel & Services Marketplace

**Status:** Phase 1 Development (Core Platform)

## Project Overview

KAYA.GE is a Georgian-market travel and lifestyle marketplace built on Next.js 14, featuring hotels, restaurants, tours, car rentals, services, and unique experiences. Powered by NINO AI travel assistant and integrated payment processing.

### Key Features (Phase 1)
- ✅ Multi-category marketplace (hotels, restaurants, cars, tours, services, salons)
- ✅ AI-powered travel assistant (NINO/KLARA with Claude API)
- ✅ Real-time availability management with double-booking prevention
- ✅ Subscription billing (20 GEL/month flat fee)
- ✅ Card payment integration (Stripe)
- ✅ Reviews and ratings system
- ✅ In-app messaging between tourists and businesses
- ✅ Responsive design with Framer Motion animations
- ✅ Muse - Georgia information hub
- ⏳ Admin panel for moderation and management

## Tech Stack

### Frontend
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** Lucide React
- **Forms:** React Hook Form
- **State Management:** Zustand

### Backend
- **Database:** PostgreSQL via Supabase
- **Authentication:** Supabase Auth
- **Payments:** Stripe + Georgian gateways (Phase 2)
- **AI:** Anthropic Claude Sonnet 4
- **Maps:** Google Maps API

### Infrastructure
- **Hosting:** Vercel (frontend)
- **Database:** Supabase (hosted PostgreSQL)
- **File Storage:** AWS S3 / Cloudflare R2 (configured in Supabase)

## Project Structure

```
kaya-ge/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── listings/          # Listings CRUD
│   │   ├── bookings/          # Booking management
│   │   ├── ai/chat/           # AI chat endpoint
│   │   └── ...
│   ├── components/            # Reusable React components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Map.tsx
│   │   └── ...
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Homepage
│   ├── search/                # Search results page
│   ├── listing/[id]/          # Listing detail page
│   ├── chat/                  # AI chat page
│   ├── muse/                  # Georgia info hub
│   └── ...other pages...
├── lib/
│   ├── supabase.ts            # Supabase client
│   └── ...utilities...
├── public/
│   └── images/
├── database.sql               # Database schema
├── package.json
├── tsconfig.json
├── next.config.mjs
└── README.md

```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+
- npm or yarn
- Git account
- Supabase account (free tier available)
- Anthropic API key
- Stripe account
- Google Maps API key

### 2. Clone and Install

```bash
git clone <repository>
cd airbnb
npm install
```

### 3. Database Setup

**Create Supabase Project:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to SQL Editor
4. Run the contents of `database.sql` to create all tables and indexes

**Enable Row Level Security (RLS):**
- All tables already have RLS enabled in the schema
- Public read policies for listings, reviews, muse articles
- User-specific policies for messages, chats

### 4. Environment Configuration

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
```

**Required Environment Variables:**

```
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Anthropic (AI)
ANTHROPIC_API_KEY=sk-ant-...

# Stripe (Payments)
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with: openssl rand -base64 32
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema Overview

### Core Tables
- **users** - Tourist and business accounts
- **businesses** - Business profiles (hotels, restaurants, etc.)
- **listings** - Individual properties/services/experiences
- **bookings** - Reservations with payment tracking
- **reviews** - Ratings and guest feedback
- **messages** - In-app communication
- **availability_blocks** - Calendar/booking prevention
- **subscriptions** - 20 GEL monthly billing
- **muse_articles** - Georgia information content
- **ai_chat_history** - Conversation logs

### Key Constraints
- **Double-booking prevention:** Database-level uniqueness on availability_blocks
- **Payment integrity:** Strict status tracking (pending → completed/refunded)
- **Data isolation:** Row-level security for user privacy
- **Audit trail:** Created_at/updated_at on all tables

## API Endpoints (Phase 1)

### Authentication
- `POST /api/auth/register` - Tourist or business signup
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/logout` - Session invalidation

### Listings
- `GET /api/listings` - Search with filters
- `GET /api/listings/[id]` - Listing details
- `POST /api/listings` - Create listing (business only)
- `PUT /api/listings/[id]` - Update listing
- `DELETE /api/listings/[id]` - Archive listing

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - User's bookings
- `PUT /api/bookings/[id]/confirm` - Business accepts booking
- `PUT /api/bookings/[id]/cancel` - Cancel booking
- `PUT /api/bookings/[id]/complete` - Mark complete

### Reviews
- `POST /api/reviews` - Submit review
- `POST /api/reviews/[id]/reply` - Business reply to review
- `GET /api/listings/[id]/reviews` - All reviews for listing

### Messages
- `GET /api/messages/[booking_id]` - Conversation thread
- `POST /api/messages` - Send message

### AI Chat
- `POST /api/ai/chat` - NINO conversation (no auth required, but can track users)

## Key Features Explained

### 1. Search & Filtering
**Filters available for all categories:**
- City/Region dropdown
- Price range slider
- Star rating filter
- Availability calendar checker
- Sort by: recommended, price, rating, newest

**Example search request:**
```
GET /api/listings?category=hotels&city=Tbilisi&minPrice=50&maxPrice=300&sort=rating&page=1
```

### 2. Double-Booking Prevention
Database ensures no overlapping reservations:
- `availability_blocks` table tracks booked/blocked dates
- Booking creation checks conflicts before insert
- Date range locks prevent race conditions

### 3. Subscription Billing
- 20 GEL/month flat fee per listing (not per booking)
- Auto-renews on next_billing_date
- Stripe webhook handles payment events
- 3-day grace period before suspension

### 4. NINO AI Assistant
- Built on Anthropic Claude Sonnet 4 model
- Knows about Georgian culture, food, wine, tourism
- Can recommend listings from platform
- Remembers conversation history per session
- Available on homepage widget and full `/chat` page

### 5. Reviews System
- Only completed bookings can review
- 5-star + sub-ratings (cleanliness, location, value)
- Photo upload support
- Business can reply (one per review)
- Auto-publish after 24h if no moderation flag

## Testing the Platform

### Test Data
Run this in Supabase SQL editor to create sample listings:

```sql
INSERT INTO public.listings (business_id, title, description, category, price_per_night, location, is_published)
VALUES 
  ('test-business-id', 'Sample Hotel', 'A beautiful hotel in Tbilisi', 'hotels', 100, 'Tbilisi', true),
  ('test-business-id', 'Restaurant', 'Georgian cuisine', 'restaurants', 50, 'Tbilisi', true);
```

### Test User Flow
1. Navigate to `/search` → filters work
2. Click listing → detail page shows availability
3. Select dates → price calculated correctly
4. Start chat at `/chat` → NINO responds

## Deployment

### Deploy to Vercel
```bash
npm run build
git push origin main  # Vercel auto-deploys on push
```

### Environment in Production
Set environment variables in Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

### Database Backups
Supabase automatically backs up daily. Manual backup:
```
Dashboard → Settings → Backups → Create backup
```

## Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|---|
| Homepage load | < 2s | SSR, image optimization, CDN |
| Search response | < 300ms | Database indexes, pagination |
| Uptime | 99.9% | Vercel + Supabase reliability |
| SEO | Indexable | SSR, sitemap.xml, schema markup |

## Security Checklist

- ✅ All passwords hashed (Supabase Auth handles)
- ✅ Row-level security on all tables
- ✅ API endpoints validate auth tokens
- ✅ Sensitive keys in environment variables only
- ✅ HTTPS enforced in production
- ✅ OWASP Top 10 protections in place
- ⏳ Rate limiting (to implement)
- ⏳ CSRF tokens (to implement)

## Known Issues & To-Do

### Phase 1 Blockers
- [ ] Admin panel not yet built
- [ ] Email notifications not implemented
- [ ] SMS verification optional
- [ ] Payment refunds need manual processing
- [ ] Multi-language support (Georgian/English/Russian) - Phase 2

### Phase 2 Features
- [ ] Georgian Moment (24h experiences)
- [ ] Kaya Connect (local buddy service)
- [ ] Trip Mood AI Planner
- [ ] Georgian Table (family supra bookings)
- [ ] E-commerce supplies shop
- [ ] Digital agency service requests
- [ ] Mobile app (React Native)
- [ ] Georgian payment gateways

## Team Collaboration

### Git Workflow
```bash
# Feature branches
git checkout -b feature/your-feature-name
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
# Create PR, review, merge

# Main branch is production-ready
```

### Code Standards
- Use TypeScript strictly (noImplicitAny: true)
- Follow ESLint rules
- Components in `components/`, pages in `app/`
- API routes with clear naming
- Comments for complex logic

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Stripe Docs:** https://stripe.com/docs/api
- **Claude API:** https://www.anthropic.com/docs

## License

Confidential - Do not share outside development team

---

**Last Updated:** May 2026  
**Current Phase:** 1 (Core Platform)  
**Next Milestone:** Admin panel + multilingual support
