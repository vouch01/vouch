import { Router } from "express";
const router: Router = Router();

import {CollectPaymentController} from '../controller/payment.controller.js'
import { paymentRateLimit } from "../middleware/auth.middleware.js";

router.get("/:checkoutToken",paymentRateLimit,  CollectPaymentController)

export default router ;