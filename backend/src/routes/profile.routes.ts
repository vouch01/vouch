import { Router } from "express";
const router: Router = Router();

import {RetrieveVendorController, UpdateDetailsController} from '../controller/profile.controller.js'
import {authenticate} from "../middleware/auth.middleware.js"

router.get("/retrieve", authenticate, RetrieveVendorController)
router.patch("/update", authenticate,UpdateDetailsController )

export default router ;