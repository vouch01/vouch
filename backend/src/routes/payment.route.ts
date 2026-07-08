import { Router } from "express";
const router: Router = Router();

import {CollectPaymentController} from '../controller/payment.controller.js'
import {authenticate} from "../middleware/auth.middleware.js"

router.get("/:checkoutToken", authenticate, CollectPaymentController)

export default router ;