import { Router } from "express";
const router: Router = Router();

import {CreateVendorController, LoginVendorController, GenerateOtpController, VerifyOtpController, PasswordResetController} from "../controller/auth.controller.js"
import {otpRateLimit} from "../middleware/auth.middleware.js"

router.post("/signup", CreateVendorController)
router.post("/login", LoginVendorController)
router.get("/otp",otpRateLimit, GenerateOtpController)
router.post("/verify", otpRateLimit, VerifyOtpController)
router.post("/reset", otpRateLimit, PasswordResetController)


export default router ;