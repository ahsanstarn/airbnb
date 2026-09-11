# KAYA.GE Environment Variables Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Vercel account (for deployment)
- Supabase account (for database and auth)
- Stripe account (for payments)
- Anthropic API key (for Claude AI)
- Google Maps API key

## Environment Variables

Copy these to your `.env.local` file:

```bash
# ======================
# SUPABASE CONFIGURATION
# ======================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ======================
# STRIPE CONFIGURATION
# ======================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
STRIPE_SECRET_KEY=sk_live_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ======================
# ANTHROPIC (Claude AI)
# ======================
ANTHROPIC_API_KEY=sk-ant-your-key-here

# ======================
# GOOGLE MAPS
# ======================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-key

# ======================
# APP CONFIGURATION
# ======================
NEXT_PUBLIC_APP_URL=https://kaya.ge
APP_SECRET=your-secret-key-change-in-production
NODE_ENV=production

# ======================
# GEORGIAN GATEWAY (Phase 1)
# ======================
BOG_MERCHANT_ID=your-bog-merchant-id
BOG_SECRET_KEY=your-bog-secret-key
TBC_CLIENT_ID=your-tbc-client-id
TBC_CLIENT_SECRET=your-tbc-client-secret

# ======================
# EMAIL CONFIGURATION
# ======================
SENDGRID_API_KEY=your-sendgrid-key
SENDGRID_FROM_EMAIL=noreply@kaya.ge

# ======================
# ANALYTICS & MONITORING
# ======================
SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Setup Steps

### 1. Supabase Setup
```bash
# Create new Supabase project
# 1. Go to supabase.com
# 2. Create new project
# 3. Copy connection strings to .env.local
# 4. Run database migrations (see MIGRATIONS.md)
```

### 2. Stripe Setup
```bash
# Create Stripe account
# 1. Go to stripe.com
# 2. Get API keys from dashboard
# 3. Create webhook endpoint for events:
#    Events: payment_intent.succeeded, payment_intent.payment_failed
#    Endpoint: https://your-domain/api/webhooks/stripe
```

### 3. Anthropic API Setup
```bash
# Get Claude API key from console.anthropic.com
# Keep this secure - never expose in frontend code
```

### 4. Google Maps API
```bash
# Create project in Google Cloud Console
# Enable Maps JavaScript API and Places API
# Create API key with restrictions
```

### 5. Development Server
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### 6. Database Migrations
```bash
# See database-schema.sql for full schema
# Option A: Use Supabase Dashboard to run SQL
# Option B: Use migration tool:
psql postgresql://user:password@host:port/dbname < database-schema.sql
```

## Deployment to Vercel

### 1. Connect Repository
```bash
vercel link
# Follow prompts to connect GitHub repo
```

### 2. Set Environment Variables in Vercel
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
# ... add all other env variables
```

### 3. Deploy
```bash
vercel deploy --prod
```

## Testing Checklist

- [ ] Homepage loads with animations
- [ ] Search filters work correctly
- [ ] Listing cards display with 3D hover effects
- [ ] Hero section has smooth animations
- [ ] Responsive design works on mobile/tablet
- [ ] Navigation links work
- [ ] Liquid glass effects visible
- [ ] All transitions smooth (no jank)

## Common Issues

### Issue: CSS animations not working
**Solution**: Ensure `globals-new.css` and `animations.css` are imported in `layout.tsx`

### Issue: Supabase connection error
**Solution**: Check NEXT_PUBLIC_SUPABASE_URL and ANON_KEY in .env.local

### Issue: Images not loading
**Solution**: Add image domains to `next.config.mjs` remotePatterns

### Issue: Animations jank on mobile
**Solution**: Check performance settings, reduce particle count in Hero component

## Next Steps After Deployment

1. Set up analytics (Google Analytics, Sentry)
2. Configure email service (SendGrid)
3. Set up payment webhooks (Stripe)
4. Verify SSL certificate
5. Set up domain DNS records
6. Test payment flow end-to-end
7. Launch marketing campaigns

## Support & Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Anthropic Claude Docs](https://docs.anthropic.com)
