import { Router } from "express";
const router: Router = Router();

import {CreateVendorController, LoginVendorController} from "../controller/auth.controller.js"
// import {authenticate} from "../middleware/auth.middleware.js"

router.post("/signup", CreateVendorController)
router.post("/login", LoginVendorController)

export default router ;