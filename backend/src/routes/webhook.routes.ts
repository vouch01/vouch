import {Router} from "express"
import { verifySignature } from "../middleware/webhook.middleware.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { eq  } from "drizzle-orm";
import { db } from "../db/index.js";

const router:Router =Router()

router.post("/nomba", verifySignature, async (req:any, res:any) => {
  const payload = req.body

  const alreadyProcessed = await db.query.webhook_events.findFirst({
    where: eq(webhook_events.nomba_transaction_id, payload.data.transaction.transactionId)
  })

  if (alreadyProcessed) {
    return res.status(200).json({ received: true, duplicate: true })
  }
  
  console.log('Webhook Received:', JSON.stringify(payload , null , 2));
  res.status(200).json({received: true})

})

export default router;