import {Router} from "express"
import dotenv from 'dotenv'
import webhookRoutes from "./webhook.routes.js"
import { verifySignature } from "../middleware/webhook.middleware.js"
import vendorRoutes from "./auth.routes.js"
const router:Router =Router()

dotenv.config()


router.use("/webhook",verifySignature, webhookRoutes)
router.use("/vendor", vendorRoutes)

export default router;