import { Router } from "express";
const router: Router = Router();

import {CreateVendorController} from "../controller/vendor.controller.js"
import {authenticate} from "../middleware/auth.middleware.ts.js"

router.post("/signup", CreateVendorController)

export default router ;