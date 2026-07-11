import { Router } from "express";
const router: Router = Router();

import {CreateOrderController, GetAllOrderController, GetOrderByIdController, DeleteOrderById, GetOrderAuthPinController, GenerateRiderLinkController, RiderCheckoutController} from "../controller/order.controller.js"
import {authenticate} from "../middleware/auth.middleware.js"

router.post('/create', authenticate, CreateOrderController)
router.get('/all', authenticate, GetAllOrderController)
router.get('/:id', authenticate, GetOrderByIdController)
router.delete('/cancel/:id', authenticate,DeleteOrderById )
router.get('/status/:checkoutToken',GetOrderAuthPinController)
router.get('/generate/:orderId', authenticate, GenerateRiderLinkController)
router.get('/checkout/:riderToken', RiderCheckoutController)

export default router;
