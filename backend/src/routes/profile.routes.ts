import { Router } from "express";
const router: Router = Router();

import {RetrieveVendorController} from '../controller/profile.controller.js'
import {authenticate} from "../middleware/auth.middleware.js"

router.get("/retrieve", authenticate, RetrieveVendorController)


export default router ;