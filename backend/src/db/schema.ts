import {
  pgTable,
  pgEnum,
} from "drizzle-orm/pg-core";
import * as t from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers.js";

// export const rolesEnum = pgEnum("roles", ["VENDOR", "BUYER", "RIDER"]);
export const otpTokenStatusEnum =pgEnum("otp_token_status", [
  "USED",
  "UNUSED",
  "EXPIRED"
])
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "PAID_IN_ESCROW",
  "DISPATCHED",
  "SETTLED",
  "EXPIRED",
  "REFUNDED",
]);


export const vendors = pgTable("vendors", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  business_name: t.text("business_name").notNull(),
  email: t.text("email").notNull().unique(),
  password_hash: t.text("password_hash").notNull(),
  bank_code: t.text("bank_code").notNull(),
  bank_account_number: t.text("bank_account_number").notNull(),
  bank_account_name: t.text("bank_account_name").notNull(),
  ...timestamps
});

export const orders = pgTable("orders", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  vendor_id: t.uuid("vendor_id").references(() => vendors.id).notNull(),
  buyer_phone: t.text("buyer_phone"),
  buyer_email: t.text("buyer_email").unique(),
  item_description: t.text("item_description").notNull(),
  expected_amount: t.integer("expected_amount").notNull(),
  amount_paid: t.integer("amount_paid").default(0).notNull(),
  status: orderStatusEnum("status").default("PENDING_PAYMENT").notNull(),
  virtual_account_number: t.text("virtual_account_number"),
  virtual_account_ref: t.text("virtual_account_ref").notNull().unique(),
  virtual_account_holder_id: t.text("v irtual_account_holder_id"),
  payout_amount: t.integer("payout_amount"),
  expires_at: t.timestamp("expires_at").notNull(),
  delivery_pin_hash: t.text("delivery_pin_hash"),
  rider_token: t.text("rider_token").unique(),
  checkout_token: t.text("checkout_token").unique().notNull(),
  pin_submitted_at: t.timestamp("pin_submitted_at"),
  settled_at: t.timestamp("settled_at"),
  ...timestamps
});

export const webhook_events = pgTable("webhook_events", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  nomba_transaction_id: t.text("nomba_transaction_id").notNull().unique(),
  order_id: t.uuid("order_id").references(() => orders.id),
  event_type: t.text("event_type").notNull(),
  payload: t.text("payload").notNull(),
  processed_at: t.timestamp("processed_at").defaultNow().notNull(),
  ...timestamps
});

export const otp_tokens = pgTable("otp_tokens", {
  id: t.uuid("id").primaryKey().defaultRandom(),
  vendor_id: t.uuid("vendor_id").references(() => vendors.id).notNull(),
  verified:t.boolean("is_active").default(false),
  otp_token: t.varchar("otp_token", {length: 255}),
  status: otpTokenStatusEnum("status").default("UNUSED").notNull(),
  expires_at: t.timestamp("expires_at").notNull(),
  ...timestamps
})

