<!-- 1. Project Overview       ← what Vouch does in 3 lines
2. Architecture           ← system diagram or flow description
3. Tech Stack             ← TypeScript, Express, Drizzle, BullMQ, PostgreSQL, Nomba
4. Nomba APIs Used        ← Virtual Accounts, Transfers, Webhooks, Requery
5. Database Schema        ← brief description of each table
6. API Endpoints          ← method, path, description, auth required
7. State Machine          ← the 6 order states and what triggers each
8. Setup & Installation   ← clone, .env, migrate, run
9. Environment Variables  ← list every key in .env.example
10. Testing  -->

```text
## FILE STRUCTURE

├── backend                   # TypeScript + Express + Drizzle
│   ├── src
│   │   ├── db
│   │   │   ├── schema.ts     # Drizzle schema definitions (Orders, History)
│   │   │   └── index.ts      # Database connection (Neon/Supabase client)
│   │   ├── services
│   │   │   └── auth.service.ts      # Third-party API wrapper
│   │   │   └── mail.service.ts      # Templates for different Emails
│   │   │   └── order.service.ts      # Third-party API wrapper
│   │   │   └── payment.service.ts      # Third-party API wrapper
│   │   │   └── profile.service.ts      # Third-party API wrapper
│   │   │   └── token.service.ts      # Third-party API wrapper
│   │   ├── controllers
│   │   │   ├── auth.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── profile.controller.ts
│   │   ├── routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── index.routes.ts
│   │   │   ├── order.routes.ts
│   │   │   └── payment.routes.ts
│   │   ── index.ts          # Server entry point, express app config, node-cron
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


## ORDER STATES

| ORDER_STATE       | TRIGGER_EVENT                                     | SYSTEM_ACTION                                                                 |
|-------------------|----------------------------------------------------|-------------------------------------------------------------------------------|
| **PENDING_PAYMENT** | Vendor creates escrow link.                        | Generates Nomba Dynamic Virtual Account *(expiryDate: 30 mins)*.              |
| **PAID_IN_ESCROW**  | Nomba Payment Webhook fires + Server Requery clears. | Hashes random 4-digit PIN, sends via email/SMS to Buyer, updates Vendor dashboard. |
| **DISPATCHED**      | Vendor hands package to courier.                   | Vendor marks order as "Dispatched" in dashboard.                              |
| **SETTLED**         | Rider inputs correct PIN at doorstep.              | Captures GPS/Timestamp, executes Nomba Bank Account Lookup + Transfer API to Vendor’s bank account. |
| **EXPIRED** | Countdown timer hits 0          | Marks account invalid, reverses funds if partial payment occurred.            |
| **REFUNDED** | Dispute raised          | Freezes funds in escrow , refunds fund automatically if dispute persists after 5 days            |


## DATABASE SCHEMA 

| Tables       | Purpose                                     |  |
|-------------------|----------------------------------------------------|-------------------------------------------------------------------------------|
Vendors                     |  Store vendors required details
Orders                     |  Store order details and entities tied to buyer and rider.
Webhook_events                     |  Store payloads from payment & payout notification
otp_tokens                     |  Store vendor reset tokens 