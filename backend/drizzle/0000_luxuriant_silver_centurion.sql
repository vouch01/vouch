CREATE TYPE "public"."order_status" AS ENUM('PENDING_PAYMENT', 'PAID_IN_ESCROW', 'DISPATCHED', 'SETTLED', 'EXPIRED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."otp_token_status" AS ENUM('USED', 'UNUSED', 'EXPIRED');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" varchar NOT NULL,
	"vendor_id" uuid NOT NULL,
	"buyer_phone" text,
	"buyer_email" text,
	"item_description" text NOT NULL,
	"additional_notes" text,
	"delivery_address" text,
	"expected_amount" integer NOT NULL,
	"amount_paid" integer DEFAULT 0 NOT NULL,
	"status" "order_status" DEFAULT 'PENDING_PAYMENT' NOT NULL,
	"virtual_account_number" text,
	"virtual_account_ref" text NOT NULL,
	"virtual_account_holder_id" text,
	"payout_amount" integer,
	"expires_at" timestamp NOT NULL,
	"delivery_pin_hash" text,
	"rider_token" text,
	"checkout_token" text NOT NULL,
	"pin_submitted_at" timestamp,
	"settled_at" timestamp,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "orders_idempotency_key_unique" UNIQUE("idempotency_key"),
	CONSTRAINT "orders_buyer_email_unique" UNIQUE("buyer_email"),
	CONSTRAINT "orders_virtual_account_ref_unique" UNIQUE("virtual_account_ref"),
	CONSTRAINT "orders_rider_token_unique" UNIQUE("rider_token"),
	CONSTRAINT "orders_checkout_token_unique" UNIQUE("checkout_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "otp_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"vendor_id" uuid NOT NULL,
	"verified" boolean DEFAULT false,
	"otp_token" varchar(255),
	"status" "otp_token_status" DEFAULT 'UNUSED' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"bank_code" text,
	"bank_account_number" text,
	"bank_account_name" text,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "vendors_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "webhook_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nomba_transaction_id" text NOT NULL,
	"order_id" uuid,
	"event_type" text NOT NULL,
	"payload" text NOT NULL,
	"processed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "webhook_events_nomba_transaction_id_unique" UNIQUE("nomba_transaction_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orders" ADD CONSTRAINT "orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "otp_tokens" ADD CONSTRAINT "otp_tokens_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "webhook_events" ADD CONSTRAINT "webhook_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
