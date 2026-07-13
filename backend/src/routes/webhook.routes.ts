import { Router } from "express";
import { verifySignature } from "../middleware/webhook.middleware.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { paymentQueue } from "../lib/payment.queue.js";
const router: Router = Router();

router.post("/nomba", verifySignature, async (req: any, res: any) => {
  const payload = req.body;

  switch (payload.event_type) {
    case "payment_success":
      await paymentQueue.add("process-payment", payload);
      console.log("payment-processing job queued");
      break;
    case "payout_success":
      await paymentQueue.add("payout_confirmation", payload);
      console.log("payment-confirmation job queued");
      break;
    default:
      console.warn("Unhandled webhook event type:", payload.event_type);
  }

  console.log("Webhook Received:", JSON.stringify(payload, null, 2));
  res.status(200).json({ received: true });
});

export default router;
