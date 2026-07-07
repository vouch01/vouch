import { Router } from "express";
const router: Router = Router();

import {CreateOrderController} from "../controller/order.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"

router.post('/create', authenticate, CreateOrderController)

export default router;
