import { Router } from "express";
const router: Router = Router();

import {CollectPaymentController} from '../controller/payment.controller.js'

router.get("/:checkoutToken", CollectPaymentController)

export default router ;