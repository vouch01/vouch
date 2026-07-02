CREATE TYPE "order_status" AS ENUM('PENDING_PAYMENT', 'PAID_IN_ESCROW', 'DISPATCHED', 'SETTLED', 'EXPIRED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "roles" AS ENUM('VENDOR', 'BUYER', 'RIDER');--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"vendor_id" uuid NOT NULL,
	"buyer_phone" text,
	"buyer_email" text UNIQUE,
	"item_description" text NOT NULL,
	"expected_amount" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"status" "order_status" DEFAULT 'PENDING_PAYMENT'::"order_status" NOT NULL,
	"virtual_account_number" text,
	"virtual_account_ref" text NOT NULL UNIQUE,
	"v irtual_account_holder_id" text,
	"payout_amount" integer,
	"expires_at" timestamp NOT NULL,
	"delivery_pin_hash" text,
	"rider_token" text UNIQUE,
	"checkout_token" text NOT NULL UNIQUE,
	"pin_submitted_at" timestamp,
	"settled_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"business_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"bank_code" text NOT NULL,
	"bank_account_number" text NOT NULL,
	"bank_account_name" text NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"nomba_transaction_id" text NOT NULL UNIQUE,
	"order_id" uuid,
	"event_type" text NOT NULL,
	"payload" text NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id");--> statement-breakpoint
ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_order_id_orders_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id");