ALTER TABLE "otp_tokens" RENAME COLUMN "is_active" TO "verified";--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "bank_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "bank_account_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "vendors" ALTER COLUMN "bank_account_name" DROP NOT NULL;