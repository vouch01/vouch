ALTER TABLE "otp_tokens" ADD COLUMN "is_active" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "otp_tokens" ADD COLUMN "status" "otp_token_status" DEFAULT 'UNUSED'::"otp_token_status" NOT NULL;--> statement-breakpoint
ALTER TABLE "otp_tokens" ALTER COLUMN "otp_token" SET DATA TYPE varchar(255) USING "otp_token"::varchar(255);