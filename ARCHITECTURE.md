# KAYA.GE Platform Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                        │
│  Next.js 14 (React 18) + Tailwind CSS + Framer Motion      │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTPS/REST API
                 ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (Serverless)                │
│  /api/auth/* → /api/listings/* → /api/bookings/*           │
└────────────────┬────────────────────────────────────────────┘
                 │ 
        ┌────────┼────────┐
        ▼        ▼        ▼
    ┌───────────────────────────┐   ┌──────────────────┐
    │  SUPABASE (PostgreSQL)    │   │  Claude API      │
    │  - Data Storage           │   │  (AI Responses)  │
    │  - Auth                   │   │  (chat, advice)  │
    │  - RLS Security           │   └──────────────────┘
    │  - Real-time Updates      │
    └───────────────────────────┘
            │
        ┌───┴───┐
        ▼       ▼
    S3/R2      Stripe
    (Images)  (Payments)
```

## Data Flow

### 1. User Search Flow
```
HomePage Search → API /listings?filters
  ↓
Supabase Query (with indexes)
  ↓
Return paginated results
  ↓
Search Page displays with filters
```

### 2. Booking Flow
```
User clicks listing
  ↓
/listing/[id] loads details + availability
  ↓
User selects dates + guest count
  ↓
POST /api/bookings (create booking)
  ↓
Check availability_blocks table (prevent double-booking)
  ↓
If clear, create booking record
  ↓
Redirect to payment (Stripe)
  ↓
On success, mark booking as CONFIRMED
```

### 3. AI Chat Flow
```
User types message in /chat or widget
  ↓
POST /api/ai/chat
  ↓
Claude API + current listings context
  ↓
NINO responds with recommendation or advice
  ↓
Display response, maintain conversation history
```

## Database Design Principles

### Normalization
- Each entity in its own table
- Foreign keys enforce referential integrity
- No data duplication

### Performance
- Indexes on frequently queried columns
- Pagination for large result sets
- Denormalized rating on listings table for speed

### Security
- Row-level security (RLS) on all tables
- User authentication via Supabase Auth
- Service role key only for server operations

### Data Integrity
- Constraints prevent invalid states
- Check constraints on numeric fields
- Unique constraints on critical fields

## API Architecture

### Authentication Layer
```
All requests → Check Bearer token
  ├─ Valid → Extract user ID
  ├─ Use user ID for data authorization
  └─ Invalid → Return 401
```

### Error Handling
```
All endpoints:
- Try/catch blocks
- Return JSON { error: "message" }
- Consistent HTTP status codes
- Validation before database operations
```

### Rate Limiting (To Implement)
- 100 requests/min per IP
- 1000 requests/day per user
- Stripe webhook rate limited by Stripe

## Frontend Component Hierarchy

```
Root Layout
├─ Navbar (persistent)
├─ Pages (dynamic based on route)
│  ├─ HomePage
│  │  ├─ HeroSection
│  │  ├─ CategoriesGrid
│  │  ├─ FeaturedListingsGrid
│  │  └─ CTASection
│  ├─ SearchPage
│  │  ├─ FilterSidebar
│  │  └─ ListingsGrid
│  ├─ ListingDetailPage
│  │  ├─ GalleryCarousel
│  │  ├─ BookingWidget
│  │  ├─ ReviewsSection
│  │  └─ MapComponent
│  └─ ChatPage
│     └─ AIConversation
└─ Footer (persistent)
```

## State Management

### Global State (Zustand stores - to implement)
- `authStore` - Current user, login status
- `cartStore` - Booking in progress
- `chatStore` - Conversation history
- `uiStore` - Theme, language, modals

### Local State (React hooks)
- Form inputs
- Loading/error states
- UI toggles (modals, filters)

## Authentication Flow

### Sign Up
```
User submits form
  ↓
POST /api/auth/register
  ↓
Supabase creates auth user
  ↓
Create profile in users table
  ↓
Set role (tourist/business)
  ↓
Return JWT token
```

### Log In
```
User submits email/password
  ↓
POST /api/auth/login
  ↓
Supabase verifies credentials
  ↓
Return JWT + refresh token
  ↓
Store in localStorage (client)
  ↓
Use in Authorization header for API calls
```

### Protected Routes
```
Check for JWT token in localStorage
  ├─ Present → Show page
  └─ Missing → Redirect to /login
```

## Booking & Payment Workflow

### Creating Booking
```
1. Check availability_blocks for conflicts
2. Get listing price_per_night
3. Calculate total_price = (nights * price)
4. Create booking record (status=PENDING)
5. Return booking ID
```

### Processing Payment
```
1. Redirect to Stripe checkout
2. User enters card info
3. Stripe processes payment
4. Webhook received: /api/webhooks/stripe
5. Update booking (payment_status=COMPLETED)
6. Send confirmation email
7. Redirect to success page
```

### Cancellation
```
1. User clicks cancel
2. Check cancellation_policy
3. Calculate refund amount
4. Process refund via Stripe
5. Update booking (status=CANCELLED)
6. Free up dates in availability_blocks
```

## Search Implementation

### Query Optimization
```sql
-- Indexed search on listings
WHERE is_published = true
  AND category = $1 (indexed)
  AND location ILIKE $2 (indexed)
  AND price_per_night BETWEEN $3 AND $4
  AND overall_rating >= $5
ORDER BY $6 (depends on sort param)
LIMIT 12 OFFSET $7
```

### Filtering Logic
```
Client sends: ?category=hotels&city=Tbilisi&minPrice=50&maxPrice=300
  ↓
Server constructs WHERE clauses
  ↓
Database executes indexed query
  ↓
Response time: <300ms for 10,000+ listings
```

## Messaging System

### In-App Communication
```
Tourist sends message on booking
  ↓
INSERT into messages table
  ↓
Business receives notification
  ↓
Business can reply
  ↓
Messages stored per booking_id
  ↓
Privacy: only sender/receiver can read
```

## Review System

### Creating Review
```
1. Verify booking is COMPLETED
2. User only has 1 review per booking
3. Submit star ratings + text + photos
4. Store with is_published = false (moderation)
5. Auto-publish after 24h if not flagged
```

### Review Moderation
```
Trigger: New review submitted
  ↓
Admin sees in moderation queue
  ↓
Check for spam/abuse/language
  ├─ Approve → is_published = true
  └─ Reject → delete or flag
  ↓
Recalculate listing overall_rating
```

## AI Chat Integration

### System Prompt Strategy
```
NINO has access to:
- Georgian culture knowledge
- Platform listings database
- Current user preferences
- Weather data
- Event calendar
```

### Conversation Context
```
Each message includes:
- Full conversation history
- Current user (if logged in)
- Listing preferences from profile
- Current weather
```

### Response Generation
```
Claude API call:
- system: NINO_SYSTEM_PROMPT
- messages: [...conversation history, new message]
- model: claude-sonnet-4-20250514
- max_tokens: 1024

Response streamed to client in real-time
```

## Scalability Considerations

### Vertical Scaling
- More powerful database server
- Increased API memory/CPU
- More front-end bundle optimization

### Horizontal Scaling
- Stateless API (can run multiple instances)
- Database read replicas
- CDN for static assets
- Redis caching layer (to implement)

### Database Optimization
```sql
-- Existing indexes:
- businesses(user_id)
- listings(category, location, is_published)
- bookings(status, tourist_id)
- availability_blocks(listing_id, date range)

-- To add:
- Full-text search index on listings(title, description)
- Composite index on (category, location, price)
```

## Security Architecture

### Authentication
- Supabase handles password hashing (bcrypt)
- JWT tokens with 1-hour expiry
- Refresh tokens for long sessions
- Multi-factor auth (Phase 2)

### Authorization
- Row-level security policies
- User IDs in WHERE clauses
- Business ID verification on updates
- Admin flag on users table

### Data Protection
- HTTPS enforced
- Sensitive data encrypted at rest (Supabase)
- PII never logged
- GDPR compliance ready

### API Security
- Input validation on all endpoints
- SQL injection prevented by parameterized queries
- CSRF tokens (to implement)
- Rate limiting (to implement)
- API key rotation (Phase 2)

## Deployment Pipeline

### Development
```
local machine
  ↓
npm run dev
  ↓
test with Supabase dev instance
```

### Staging
```
git push to staging branch
  ↓
Vercel auto-deploys
  ↓
Uses staging Supabase project
  ↓
QA testing
```

### Production
```
git push to main
  ↓
Vercel auto-deploys
  ↓
Uses production Supabase project
  ↓
Monitoring active
  ↓
Backups scheduled
```

## Monitoring & Observability

### To Implement
- Sentry error tracking
- LogRocket session replay
- Datadog APM
- Vercel Analytics
- Custom logging

### Metrics to Track
- API response times
- Database query performance
- Error rates and types
- Conversion funnel
- Search query patterns

## Disaster Recovery

### Backup Strategy
- Daily automated Supabase backups
- Weekly full snapshot
- Manual backup before major releases
- 30-day retention

### Recovery Plan
- Database corruption: restore from backup
- API down: automatic Vercel failover
- Data loss: point-in-time recovery up to 30 days

---

This architecture is designed for:
✅ Fast performance
✅ High availability
✅ Scalability
✅ Security
✅ Developer experience
