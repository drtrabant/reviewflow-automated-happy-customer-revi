

# PRD: ReviewFlow

**Domain:** starcatch.io
**Tagline:** "Catch your 5-star moments before they disappear."

---

## Problem Statement

Small business owners face a brutal asymmetry: unhappy customers leave reviews unprompted, while happy customers walk out the door silently. The result is that online profiles skew negative, directly costing revenue (a Harvard Business School study found a one-star Yelp increase drives 5-9% revenue lift).

Existing solutions (Podium, Birdeye, NiceJob) cost $250-400/month, require onboarding calls, and are built for businesses with dedicated marketing staff. A contractor finishing a kitchen remodel or a salon owner between appointments doesn't have time for a dashboard — they need something that works in 10 seconds from their phone.

**Our wedge:** We're not building a review management platform. We're building a single-action tool that turns a happy customer moment into a Google review in under 30 seconds, with AI-powered sentiment gating so unhappy feedback gets routed to a private channel instead of Google. We start with **home service contractors** (plumbers, electricians, roofers, remodelers) — a vertical where:
- Jobs are high-ticket ($500-$25K), making each review extremely valuable
- There's a clear "moment of delight" (job completion walkthrough)
- Existing tools are poorly adapted to field-service workflows
- Owners are tech-pragmatic but time-poor

---

## Target User Persona

**Name:** Mike Delgado
**Role:** Owner/operator of a 4-person residential plumbing company in Austin, TX
**Age:** 38
**Revenue:** ~$600K/year
**Tech comfort:** Uses QuickBooks, texts customers from his personal phone, has a Google Business Profile he set up two years ago and rarely checks
**Pain points:**
- Has 23 Google reviews (competitor across town has 180+)
- Knows happy customers would leave reviews "if he asked" but feels awkward doing it in person
- Tried asking via text twice — felt spammy, got one review
- Lost a bid last month to a competitor; the homeowner said "they had way more reviews"
- Will not log into a dashboard daily. Will not watch an onboarding video. Will pay $49/month if it clearly works.

**Behavioral insight:** Mike's highest-leverage moment is standing in the customer's kitchen after fixing the problem. The customer is relieved and grateful. If Mike could tap one button on his phone and the customer got a frictionless review prompt within 60 seconds, conversion would be 10-20x higher than a follow-up text sent the next day.

---

## MVP Feature List

### Feature 1: One-Tap Review Request (Core Loop)
**Justification:** This IS the product. Everything else is supporting infrastructure.

- Business owner opens starcatch.io on mobile → sees a single input field for customer's phone number (or name, if already in contacts)
- Taps "Send" → customer receives an SMS (via Twilio) within 15 seconds
- SMS contains a short branded link: "Mike from Delgado Plumbing hopes you're happy with the work! Tap to share your experience →"
- Link opens a mobile-optimized micro-page (no app install, no login)

### Feature 2: Sentiment Gate (The Differentiator)
**Justification:** This is what separates us from "just texting them your Google link." It's also the AI wedge.

- Customer lands on the micro-page and sees: "How was your experience with Delgado Plumbing?" with a simple 5-star tap selector
- **4-5 stars:** "Awesome! Would you share that on Google? It means the world to small businesses like ours." → Direct deep link to Google review page (pre-populated with their star rating where possible)
- **1-3 stars:** "We're sorry to hear that. Tell us what happened so we can make it right." → Private feedback form that goes directly to the business owner via email/SMS. Customer never sees Google.
- AI Enhancement: Claude analyzes the private feedback and drafts a suggested response for the business owner ("Here's a message you could send to this customer to address their concern")

### Feature 3: Business Onboarding (< 3 minutes)
**Justification:** If setup takes more than one sitting, contractors won't finish it.

- Sign up with email + Google OAuth
- Enter: Business name, Google Business Profile URL (with helper to find it), phone number, logo (optional)
- We auto-generate the branded review micro-page
- We generate a unique short link and QR code (for printed invoices/cards)
- Stripe checkout for $49/month (14-day free trial, no card required to start)

### Feature 4: Minimal Dashboard
**Justification:** Business owners need to see it's working. But keep it to one screen.

- Total requests sent (this week / all time)
- Total Google reviews captured (with star breakdown)
- Total negative feedback intercepted (with "you protected your rating" framing)
- Recent activity feed (who was sent a request, did they tap, what happened)
- Private feedback inbox with AI-drafted responses

### Feature 5: QR Code + Physical Touchpoints
**Justification:** Contractors leave invoices, put stickers on water heaters, hand out business cards. A QR code that goes to the sentiment-gated page is a passive review machine.

- Auto-generated QR code pointing to the review micro-page
- Downloadable as PNG (for printing on invoices, yard signs, vehicle wraps)
- Optional: "Leave us a review" card template (PDF) they can print at Staples

---

## Non-Goals (Explicitly Out of Scope for MVP)

| Out of Scope | Why |
|---|---|
| Multi-platform review routing (Yelp, Facebook, Nextdoor) | Google is 90% of what matters for local SEO. Complexity kills MVP speed. |
| CRM / customer database | Mike doesn't want to manage contacts. He wants to send a link and move on. |
| Automated drip campaigns / email sequences | This is what makes competitors bloated. Our UX is one-tap, not workflows. |
| Team management / multi-user accounts | MVP serves owner/operators. Teams come in v2. |
| Review response posting to Google | Requires Google Business Profile API OAuth, which adds significant onboarding friction. v2. |
| Integrations (Jobber, ServiceTitan, HouseCall Pro) | Critical for scaling in contractor vertical, but not for validating core loop. v2. |
| Custom branding beyond logo + business name | Premature. |
| Analytics / competitive intelligence | Not validated as a need yet. |
| White-label / agency features | Different business model entirely. |

---

## Technical Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | SSR for review micro-pages (SEO + fast load). API routes for backend. |
| Styling | Tailwind CSS | Rapid iteration on mobile-first UI |
| Database | Vercel KV (Redis) | Free tier handles MVP volume. Simple key-value for review requests, business profiles, analytics counters. |
| Auth | NextAuth.js with Google OAuth + email magic links | Zero-friction signup for SMB owners |
| SMS | Twilio (pay-as-you-go) | ~$0.0079/SMS segment. At 100 customers sending 50 requests/month = $40/month total platform cost. |
| AI | Anthropic Claude API (claude-3-haiku) | Haiku for cost efficiency on feedback analysis + response drafting. ~$0.001 per request. |
| Payments | Stripe Checkout + Stripe Billing | Handles trials, subscriptions, invoicing. |
| Hosting | Vercel (Pro plan) | Zero-config deployment, edge functions for SMS webhooks |
| QR Generation | `qrcode` npm library (client-side) | No external dependency needed |
| Short Links | Custom short links via Vercel redirects (starcatch.io/r/{code}) | No dependency on Bitly or similar |
| Analytics | Vercel Analytics (built-in) + custom event tracking in KV | Free tier sufficient |

---

## API Endpoints

### Auth & Business Setup
```
POST /api/auth/[...nextauth]     — NextAuth handler (Google OAuth, magic link)
POST /api/business/setup          — Create business profile
PUT  /api/business/profile        — Update business name, logo, Google URL
GET  /api/business/profile        — Fetch current business profile
```

### Core Review Flow
```
POST /api/review-request/send
  Body: { customerPhone: string, customerName?: string }
  Action: Creates review request record, sends Twilio SMS
  Returns: { requestId: string, status: "sent" }

GET  /api/r/[code]
  Action: Serves the review micro-page (this is actually a Next.js page route, not API)
  Tracks: click event on the review request

POST /api/review-request/[requestId]/rating
  Body: { rating: number }  // 1-5
  Action: Records rating, determines routing
  Returns: { route: "google" | "feedback", googleUrl?: string }

POST /api/review-request/[requestId]/feedback
  Body: { message: string }
  Action: Stores private feedback, triggers Claude analysis, notifies owner
  Returns: { received: true }
```

### SMS Webhooks
```
POST /api/webhooks/twilio/status
  Action: Receives delivery status updates from Twilio (delivered, failed, etc.)
```

### Dashboard
```
GET  /api/dashboard/stats
  Returns: { totalSent, totalClicked, totalReviews, totalIntercepted, 
             weekSent, weekReviews, starBreakdown: {1:n, 2:n, 3:n, 4:n, 5:n} }

GET  /api/dashboard/activity?page=1&limit=20
  Returns: { activities: [{ requestId, customerName, phone, sentAt, 
             clickedAt?, rating?, route?, feedbackMessage? }] }

GET  /api/dashboard/feedback
  Returns: { feedback: [{ requestId, customerName, rating, message, 
             aiDraftResponse, createdAt, resolved: boolean }] }

PUT  /api/dashboard/feedback/[requestId]/resolve
  Body: { resolved: boolean }
```

### AI
```
POST /api/ai/draft-response
  Body: { feedbackMessage: string, businessName: string, customerName?: string }
  Action: Calls Claude Haiku to generate empathetic response draft
  Returns: { draftResponse: string }
```

### Billing
```
POST /api/billing/create-checkout    — Creates Stripe Checkout session
POST /api/webhooks/stripe            — Handles subscription lifecycle events
GET  /api/billing/status             — Returns current subscription status
```

### QR / Short Links
```
GET  /api/business/qr-code           — Returns QR code as PNG data URL
GET  /api/business/review-link       — Returns the short link for the business
```

---

## Data Models

All stored in Vercel KV (Redis). Keys are prefixed by type for organization.

### Business Profile
```typescript
// Key: business:{userId}
interface BusinessProfile {
  id: string;                    // nanoid
  userId: string;                // from NextAuth
  businessName: string;
  googleBusinessUrl: string;     // Direct Google review URL
  phone: string;
  logoUrl?: string;              // Stored in Vercel Blob (free tier) or base64
  reviewPageCode: string;        // Short code for starcatch.io/r/{code}
  stripeCustomerId?: string;
  subscriptionStatus: "trial" | "active" | "canceled" | "past_due";
  trialEndsAt: string;           // ISO date
  createdAt: string;
  updatedAt: string;
}
```

### Review Request
```typescript
// Key: request:{requestId}
// Index: requests:{businessId} (sorted set by timestamp)
interface ReviewRequest {
  id: string;                    // nanoid
  businessId: string;
  customerPhone: string;         // E.164 format
  customerName?: string;
  smsStatus: "queued" | "sent" | "delivered" | "failed";
  sentAt: string;
  clickedAt?: string;
  rating?: number;               // 1-5
  route?: "google" | "feedback";
  feedbackMessage?: string;
  aiDraftResponse?: string;
  feedbackResolved: boolean;
  googleReviewConfirmed: boolean; // Whether they clicked through to Google
  createdAt: string;
}
```

### Business Stats (Denormalized Counters)
```typescript
// Key: stats:{businessId}
interface BusinessStats {
  totalSent: number;
  totalClicked: number;
  totalGoogleRouted: number;     // 4-5 star ratings
  totalFeedbackRouted: number;   // 1-3 star ratings
  stars: { 1: number; 2: number; 3: number; 4: number; 5: number };
}

// Key: stats:{businessId}:week:{weekNumber}
// Same structure, reset weekly for "this week" dashboard view
```

### Session / Rate Limiting
```typescript
// Key: ratelimit:{businessId}:daily — Integer counter with TTL
// Enforces: Free trial = 20 requests/day, Paid = 200 requests/day
```

---

## Success Metrics

### Primary (Must-hit to continue past MVP)

| Metric | Target | Measurement |
|---|---|---|
| SMS → Click-through rate | ≥ 35% | `totalClicked / totalDelivered` |
| Click → Google review redirect rate | ≥ 60% | `totalGoogleRouted / totalClicked` (indicates most customers are happy) |
| Negative feedback interception rate | 100% of 1-3 star | `totalFeedbackRouted` where `rating ≤ 3` — no leakage to Google |
| Trial → Paid conversion | ≥ 8% | Stripe data |
| Week-2 retention (still sending requests) | ≥ 40% | Active request count in week 2 vs. week 1 |

### Secondary (Informational for MVP)

| Metric | Target | Measurement |
|---|---|---|
| Average time from SMS to Google click | < 3 minutes | `clickedAt - sentAt` for google-routed requests |
| Requests sent per active business per week | ≥ 5 | Indicates product fits into workflow |
| CAC (blended) | < $150 | Total spend / new paying customers |
| NPS from business owners | ≥ 50 | In-app survey at day 14 |
| Monthly churn | < 8% | Stripe cancellation data |

### North Star Metric
**Google reviews generated per active business per month.** If this number is ≥ 4, the product is clearly delivering value (most businesses currently get 1-2 organic reviews/month).

---

## Estimated Build Time

**Total: 18 working days (3.5 weeks) for a single senior full-stack developer**

| Phase | Days | Deliverables |
|---|---|---|
| **Phase 1: Foundation** | 3 days | Next.js project setup, Vercel KV config, NextAuth (Google + magic link), Tailwind base components, Stripe integration skeleton, deployment pipeline to Vercel |
| **Phase 2: Core Loop** | 5 days | Business onboarding flow (3-step), Twilio SMS sending, review micro-page (mobile-optimized, sentiment gate UI), Google review deep-link routing, private feedback form, KV data persistence for all request states |
| **Phase 3: AI + Feedback** | 2 days | Claude Haiku integration for feedback analysis, AI-drafted response generation, feedback notification to business owner (email via Resend free tier) |
| **Phase 4: Dashboard** | 3 days | Stats overview screen, activity feed, feedback inbox with AI responses, QR code generation + download |
| **Phase 5: Billing** | 2 days | Stripe Checkout integration, trial enforcement, subscription status gating, webhook handling for lifecycle events |
| **Phase 6: Polish + Launch** | 3 days | Mobile UX polish (critical — both business owner and customer flows are mobile-primary), error handling, rate limiting, landing page (starcatch.io), SMS copy A/B test setup, Twilio number provisioning, basic SEO meta tags |

### Launch Checklist
- [ ] Twilio phone number registered + A2P 10DLC compliance (required for US SMS)
- [ ] Stripe account live mode enabled
- [ ] Google Business