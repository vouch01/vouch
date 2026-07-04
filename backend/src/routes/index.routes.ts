import {Router} from "express"
import dotenv from 'dotenv'
import webhookRoutes from "./webhook.routes.js"
import { verifySignature } from "../middleware/webhook.middleware.js"
import authRoutes from "./auth.routes.js"
const router:Router =Router()

dotenv.config()


router.use("/webhook",verifySignature, webhookRoutes)
router.use("/v1/auth", authRoutes)

export default router;