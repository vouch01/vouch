ALTER TABLE "orders" ADD COLUMN "fee" integer;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "transaction_ref" varchar;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_transaction_ref_unique" UNIQUE("transaction_ref");