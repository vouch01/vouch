import {Router} from "express"
import dotenv from 'dotenv'
import webhookRoutes from "./webhook.routes.js"
import authRoutes from "./auth.routes.js"
import profileRoutes from './profile.routes.js'
import orderRoutes from "./order.routes.js"
import paymentRoutes from "./payment.route.js"
import riderRoutes from "./rider.routes.js"

const router:Router =Router()

dotenv.config()


router.use("/webhook", webhookRoutes)
router.use("/v1/auth", authRoutes)
router.use("/v1/profile", profileRoutes)
router.use("/v1/order", orderRoutes)
router.use("/v1/pay", paymentRoutes)
router.use("/v1/rider", riderRoutes)

export default router;