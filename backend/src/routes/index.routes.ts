import {Router} from "express"
import dotenv from 'dotenv'
import webhookRoutes from "./webhook.routes.js"
import { verifySignature } from "../middleware/webhook.middleware.js"
import authRoutes from "./auth.routes.js"
import profileRoutes from './profile.routes.js'
import orderRoutes from "./order.routes.js"

const router:Router =Router()

dotenv.config()


router.use("/webhook",verifySignature, webhookRoutes)
router.use("/v1/auth", authRoutes)
router.use("/v1/profile", profileRoutes)
router.use("/v1/order", orderRoutes)

export default router;