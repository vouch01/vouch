import { Router } from "express";
const router: Router = Router();

import { GenerateRiderLinkController, RiderCheckoutController, verifyOrderDeliveryController} from "../controller/order.controller.js"
import {authenticate, authRateLimit} from "../middleware/auth.middleware.js"

router.get('/generate/:orderId', authenticate, GenerateRiderLinkController)
router.get('/verify/:riderToken', RiderCheckoutController)
router.post('/verify/:riderToken', authRateLimit, verifyOrderDeliveryController)

export default router;
