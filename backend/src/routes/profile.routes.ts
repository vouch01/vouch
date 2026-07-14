import { Router } from "express";
const router: Router = Router();

import {deleteVendorController, RetrieveVendorController, UpdateDetailsController, VerifyBankDetailsController} from '../controller/profile.controller.js'
import {authenticate} from "../middleware/auth.middleware.js"

router.get("/retrieve", authenticate, RetrieveVendorController)
router.patch("/update", authenticate,UpdateDetailsController )
router.delete("/delete", authenticate, deleteVendorController)
router.post("/verify", authenticate, VerifyBankDetailsController)

export default router ;