## FILE STRUCTURE
```text

├── backend                   # TypeScript + Express + Drizzle
│   ├── src
│   │   ├── Tests                     # Functional tests
│   │   │   ├── auth.test.ts
│   │   │   ├── order.test.ts        
│   │   │   └── payment.test.ts
│   │   │   └── profile.test.ts
│   │   │   └── test-connection.ts
│   │   ├── db
│   │   │   ├── schema.ts     # Drizzle schema definitions (Orders, History)
│   │   │   └── index.ts      # Database connection (Neon/Supabase client)
│   │   ├── services
│   │   │   └── auth.service.ts      # Auth related services [otp , login , signup, password reset]
│   │   │   └── mail.service.ts      # Templates for different Emails
│   │   │   └── order.service.ts      # orchestrates order related actions
│   │   │   └── payment.service.ts      # Payment services that run after each job gets activated
│   │   │   └── profile.service.ts      # Profile CRUD actions
│   │   │   └── token.service.ts      # JWT token 
│   │   ├── lib                         
│   │   │   ├── mailer.ts                   # Resend for email's config 
│   │   │   ├── payment.queue.ts    # Payment queue config
│   │   │   └── queue.ts                   # Email queue config
│   │   │   └── redis.ts                      # Redis config
│   │   ├── controllers                    # HTTP parser
│   │   │   ├── auth.controller.ts       
│   │   │   ├── order.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── profile.controller.ts
│   │   ├── routes                          #Routes definitions
│   │   │   ├── auth.routes.ts
│   │   │   ├── index.routes.ts        # Routes orchestration file 
│   │   │   ├── order.routes.ts        
│   │   │   └── payment.routes.ts
│   │   │   └── profile.routes.ts
│   │   │   └── rider.routes.ts
│   │   │   └── webhook.routes.ts 
│   │   ├── utils                                 # Helpers
│   │   │   ├── nomba.ts
│   │   │   ├── nombaError.ts
│   │   │   ├── uuid.ts
│   │   │   └── webhook.ts
│   │   ├── worker                              # Background workers
│   │   │   ├── email.worker.ts
│   │   │   ├── payment.worker.ts
│   │   ── app.ts          # express app config 
│   │   ── index.ts          # Server entry point, worker initialization
│   ├── drizzle.config.ts     # Drizzle CLI configuration
│   ├── package.json
│   └── tsconfig.json
│
└── README.md

```

## ARCHITECTURE

[System Architecture](https://excalidraw.com/#json=IqFvj6s_tGLgDCM-5Qh7Y,FhpIboelPpE5CCJI9N3wkQ)

![Vouch's diagram image](https://ik.imagekit.io/4wxtrbyyf/olo-designs/Vouch's-system-arch-diagram.png)

## TECH STACK

- Typescript for strict type checking  and 
- Express -- for lightweight application framework
- PostgreSQL for ACID heavy transactions
- Nomba API's
- Drizzle for Schema definition and database relational mapping
- Bullmq for asynchronous task 
- Redis  -- supports bullmq with temporary task storage 
- Jest & supertest for test driven development
- Render for reliable server hosting 
- Neon for postgreSQL hosting
- Resend for efficient Email delivery 

## ENVIRONMENT VARIABLES

Visit .env.example

## TESTING  

Tests cover auth (register/login/OTP/password reset), vendor profile, and order flow (create/retrieve/delete). Built with **Jest** + **Supertest** and `ts-jest`, running against the live Neon database with Redis and BullMQ mocked out for isolation.

### Setup

```bash
pnpm install
```

Copy `.env.example` to `.env` and fill in the values (see Environment Variables section above) — tests reuse the same Neon connection as local dev.

### Run tests

```bash
pnpm test
```
### Run database-check

```bash
pnpm db-check
```

### What's mocked vs. real

- **Real:** Postgres (Neon) — tests hit the actual database, no in-memory substitute
- **Mocked:** Redis connection and BullMQ email queue (`jest.setup.ts`) — so tests don't require a running Redis instance or send real emails
- **NODE_ENV=test** — gates test-only response fields (e.g. OTP values returned in the response body for verification, never exposed in production)

### Config files

| File | Purpose |
|------|---------|
| `jest.config.cjs` | Jest runner config, points to `tsconfig.spec.json` for TS compilation |
| `tsconfig.spec.json` | Separate TypeScript config for tests — keeps `jest`/`node` types out of the production build |
| `jest.setup.ts` | Sets `NODE_ENV=test`, mocks Redis and the email queue before any test file runs |

### Notes for reviewers
- To run a single test , add a `.skip` to other test .
- Tests run sequentially against a shared vendor record (`iziogbaraymond72@gmail.com`) created in the Auth Flow suite — order and profile tests depend on that vendor existing, so run the full suite rather than individual files in isolation.
- `--forceExit` is used in the test script since some async handles (DB pool) don't close cleanly between test files; this doesn't affect test correctness.

## ORDER STATES

| ORDER_STATE       | TRIGGER_EVENT                                     | SYSTEM_ACTION                                                                 |
|-------------------|----------------------------------------------------|-------------------------------------------------------------------------------|
| **PENDING_PAYMENT** | Vendor creates escrow link.                        | Generates Nomba Dynamic Virtual Account *(expiryDate: 30 mins)*.              |
| **PAID_IN_ESCROW**  | Nomba Payment Webhook fires + Server Requery clears. | Hashes random 4-digit PIN, sends via email/SMS to Buyer, updates Vendor dashboard. |
| **DISPATCHED**      | Vendor hands package to courier.                   | Vendor marks order as "Dispatched" in dashboard.                              |
| **SETTLED**         | Rider inputs correct PIN at doorstep.              | Captures GPS/Timestamp, executes Nomba Bank Account Lookup + Transfer API to Vendor’s bank account. |
| **EXPIRED** | Countdown timer hits 0          | Marks account invalid, reverses funds if partial payment occurred.            |
| **DISPUTED** | Dispute raised          | Freezes funds in escrow , refunds fund automatically if dispute persists after 5 days            |
| **REFUNDED** | funds refunded          | initialize a transfer to bank account provided by buyer after dipsute persists after 5 days            |


## DATABASE SCHEMA 

| Tables       | Purpose                                     |  |
|-------------------|----------------------------------------------------|-------------------------------------------------------------------------------|
Vendors                     |  Store vendors required details
Orders                     |  Store order details and entities tied to buyer and rider.
Webhook_events                     |  Store payloads from payment & payout notification
otp_tokens                     |  Store vendor reset tokens 


## REVIEWER ACCESS

**Live API:** https://api-vouch.onrender.com

**Test Flow:**
1. signup with credentials  to get a vendor token
2. `POST /v1/order/create` — creates order & generates an escrow link
3. Visit the returned `escrowLink` to see the buyer checkout page
4. Use Nomba sandbox test transfer to the displayed virtual account
5. Checkout page auto-updates with delivery PIN once payment clears using an endpoint to poll redis 
6. Vendor marks order "Dispatched" → generates rider link
7. Visit rider link, input PIN → triggers payout 
8. settlepayment job updates db with payout amount , fee and transaction reference → awaits webhook 
9. SettleWebhookConfirmation settles payment and reconciles with database. 

---

## API ENDPOINTS

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /v1/auth/register | No | Vendor signup |
| POST | /v1/auth/login | No | Vendor login |
| POST | /v1/auth/otp | No | Request password reset OTP |
| POST | /v1/auth/verify | No | Verify OTP |
| POST | /v1/auth/reset | No | Reset password |
| GET | /v1/profile/retrieve | Yes | Get vendor profile |
| PATCH | /v1/profile/update | Yes | Update vendor/bank details |
| POST | /v1/profile/verify | Yes | Confirm bank account name and store bank code before saving |
| POST | /v1/order/create | Yes | Create escrow order + virtual account |
| GET | /v1/order/all | Yes | List vendor's orders |
| GET | /v1/order/:id | Yes | Get single order |
| DELETE | /v1/order/cancel/:id | Yes | Soft-delete an order |
| GET | /v1/order/checkout/:checkoutToken | No | Buyer checkout page data |
| GET | /v1/order/status/:checkoutToken | No | Poll for delivery PIN post-payment |
| GET | /v1/rider/generate/:orderId | Yes | Generate rider verification link |
| GET | /v1/rider/verify/:riderToken | No | Rider submission page; returns order details with pin submission form |
| POST | /v1/rider/verify/:riderToken | No | Rider submits PIN to confirm delivery |
| POST | /webhook/nomba | Signature-verified | Nomba payment/payout event receiver |

---

## TECHNICAL DECISIONS & TRADE-OFFS

**Why amounts are stored in kobo, not naira**
Floating-point decimals are unsafe for money — `0.1 + 0.2 !== 0.3` in JS. Every amount column stores the smallest currency unit as an integer. Conversion to naira only happens at the API boundary when Nomba's schema explicitly requires it.

**Why webhooks are queued, not processed inline**
The webhook handler does exactly three things: verify the Nomba signature, check for a duplicate `transactionId`, and enqueue the job — then returns `200` immediately. Actual reconciliation (order matching, PIN generation, payout triggering) happens in a BullMQ worker. This means a slow DB write or Nomba API call never risks a webhook timeout/retry storm from Nomba's side.

**Idempotency, two layers**
- *Webhook events* — every processed Nomba `transactionId` is recorded in `webhook_events` before any state change, so replayed or duplicate webhooks are no-ops.
- *Order creation* — a deterministic hash of `(vendorId + buyerPhone + itemDescription + amount)` prevents duplicate orders from double-submitted forms, without requiring frontend coordination.

**Underpayment handling**
`amount_paid` is only accepted and  only transitions to `PAID_IN_ESCROW` once `amount_paid = expected_amount`, so partial payments are handled without extra buyer action.

**Token caching for Nomba auth**
Access tokens are cached in-process with expiry tracking; a request within 60 seconds of expiry triggers a refresh before the cached token is reused. Avoids re-authenticating on every single Nomba API call.

**Delivery PIN never touches the database in plaintext**
The PIN is bcrypt-hashed before storage. The raw PIN is cached in Redis with a 10-minute TTL, keyed to the order's `checkout_token`, and deleted immediately after the buyer's checkout page retrieves it once — so it's retrievable exactly one time, and expires automatically even if never claimed.

**Fee model**
Vouch charges a 1.5% escrow fee on settlement, capped at ₦2,000, deducted before payout to the vendor's bank account. This is separate from Nomba's own transfer fee, which is deducted directly from Vouch's Nomba wallet balance and isn't visible to vendors.

**Webhook recovery**
A cron job runs every 15 minutes, querying `GET /v1/transactions/accounts/{subAccountId}` for the recent time window and reconciling any `PENDING_PAYMENT` orders whose webhook may have been dropped — protecting against Nomba webhook delivery failures without relying on the buyer to notice and retry.

---

## KNOWN LIMITATIONS 

- Refunds for expired orders with partial payment are flagged for manual review, not auto-reversed
- Observability is console-log based; Winston/structured logging planned as next step
- Single-instance token cache ; horizontal scaling would need a shared cache (Redis) for the Nomba access token
- Real time notification system for multi-channel messages delivery
- Automated dispute resolution with refunds to buyer.


