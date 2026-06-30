import {Router} from "express"
import dotenv from 'dotenv'
import webhookRoutes from "./webhook.routes.js"
import { verifySignature } from "../middleware/webhook.middleware.js"

const router:Router =Router()

dotenv.config()


router.use("/webhook",webhookRoutes,verifySignature)