# Vouch
**Frictionless, account-less escrow infrastructure securing social commerce transactions via the Nomba API.**

## The Core Problem
Social commerce in Nigeria (Instagram, WhatsApp, Twitter DMs) runs entirely on blind trust. Buyers fear "payment before delivery" scams, while vendors suffer loss from "payment on delivery" logistics failures. Existing escrow solutions fail because they force casual buyers to download heavy applications and register accounts just to complete a single transaction.

## Our Solution -- VOUCH 
Vouch bridges the trust gap with a **State-Driven, Account-Less Escrow Flow**. 
1. **The Vendor** logs an order and generates a dynamic single-use payment URL.
2. **The Buyer** pays into a temporary, automated **Nomba Virtual Account** directly on their mobile web browser—zero sign-ups required.
3. **The Courier Rider** unlocks the escrowed funds at the doorstep via a lightweight numeric PIN input, triggering instant settlement to the merchant.

---

## 🏗️ System Architecture & Financial Flow

Vouch is structured as a high-performance monorepo utilizing a state-driven ledger to completely eliminate human administrative overhead. 

```text
 [Vendor Dashboard] ──(Generates Link)──> [Buyer Web View]
                                                │
                                         (Pays Nomba VA)
                                                │
                                                ▼
 [Merchant Bank App] <──(Nomba Transfer)── [Vouch Escrow Sub-Account]
                                                ▲
                                                │
                                       (Rider Enters PIN)
```

## Revenue Model
> Vouch implements an automated platform fee built directly into the database ledger:
- 1.5% platform fee deducted automatically from the merchant payout upon successful delivery.
- Hard Cap at ₦2,000 to incentivize high-ticket social commerce transactions.

## Tech Stack & Ecosystem Integration
### Core infrastructure
- Fintech APIs: Nomba API Core (Virtual Accounts for inflow collection, Bank Lookup for verification, Transfers API for payout automation).
- Database ORM: Drizzle ORM paired with PostgreSQL for schema-enforced, type-safe state transitions
- Frontend Framework: Nextjs + Tailwind CSS optimized for lightweight mobile-web responsiveness.

--

## Repository Structure
/vouch
├── /frontend
│   ├── /src
│   │   ├── /components        # UI Components (AuthForm, Navbar, etc.)
│   │   ├── /pages             # App pages (Home, Dashboard, Pricing)
│   │   ├── /hooks             # Custom React hooks (useAuth, useLogoGenerator)
│   │   ├── /lib               # Config files (Supabase, API client, constants)
│   │   ├── /styles            # Global and component styles
│   │   ├── App.tsx            # Main routing setup
│   │   └── main.tsx           # React entry point
│   ├── public/                # Public assets (icons, logos)
│   ├── tailwind.config.ts     # Configures Tailwind CSS settings
│   ├── vite.config.ts         # Contains build and development settings for the Vite bundler
│   └── package.json           # Lists frontend project dependencies, scripts, and metadata
│
├── backend/                  # TypeScript + Express + Drizzle
│   ├── src/
│   │   ├── db/
│   │   │   ├── schema.ts     # Your Drizzle schema definitions (Orders, History)
│   │   │   └── index.ts      # Database connection instance (Neon/Supabase client)
│   │   ├── services/
│   │   │   └── nomba.ts      # Third-party API wrapper (Virtual AC, Transfers, Requery)
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts      # Logic for creating link, canceling dispute
│   │   │   ├── order.controller.ts      # Logic for creating link, canceling dispute
│   │   │   ├── payment.controller.ts      # Logic for creating link, canceling dispute
│   │   │   ├── profile.controller.ts      # Logic for creating link, canceling dispute
│   │   ├── routes/
│   │   │   └── auth.routes.ts        # Express routing definitions mapping to controllers
│   │   │   └── index.routes.ts        # Express routing definitions mapping to controllers
│   │   │   └── order.routes.ts        # Express routing definitions mapping to controllers
│   │   │   └── payment.routes.ts        # Express routing definitions mapping to controllers
│   │   └── index.ts          # Server entry point, express app configuration, node-cron
│   ├── drizzle.config.ts     # Drizzle CLI configuration for migrations
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                 

## Repository Directory Roadmap
>This repository is split into isolated frontend and backend structures to maintain clean dependency separation.

---

Click through below to read the comprehensive technical breakdowns for each layer:

---

- [Frontend](./frontend) - Contains our persona-driven responsive views (Vendor Kanban Tracker, Buyer Countdown Portal, and Rider Keypad Input).
- [Backend](./backend) -Contains our Drizzle schema migrations, automated Nomba service wrappers, webhook endpoints, and transactional ledger controllers.

Please visit [Backend](./backend/README.md), for vouch's system infrastructure overview.

## Quick Start (Local Sandbox Environment)
Prerequisites
- Node.js v18+
- PostgreSQL instance [Neon]
- Nomba API Sandbox Credentials (accountId, clientId, clientSecret)

## Vouch Team
- Raymond Iziogba — Product & Backend /infrastructure engineer
- Rapahel Ime — Product Designer 
- Muhammud muhkta — Frontend Engineer
