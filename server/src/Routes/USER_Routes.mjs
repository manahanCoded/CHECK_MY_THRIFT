import { Router } from "express";
import { Login, Register, Logout } from "./Controllers/USER_Controllers.mjs";
import { Validate_Login, Validate_Register } from "../Middleware/USER_Validators/USER_Validators.mjs";

const router = Router()

router.post("/login", Validate_Login, Login)
router.post("/register", Validate_Register, Register)
router.post("/logout", Logout)


export default router