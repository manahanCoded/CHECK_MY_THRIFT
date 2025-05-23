import { Router } from "express";
import { Login, Register, Logout, Verify } from "./Controllers/USER_Controllers.mjs";
import { Validate_Login, Validate_Register, Validate_Code } from "../Middleware/USER_Validators/USER_Validators.mjs";
import userLoggin from "../Middleware/USER_Validators/LoggedUser.mjs";

const router = Router()

router.post("/login", userLoggin, Validate_Login, Login)
router.post("/register", Validate_Register, Register)
router.post("/verify", Validate_Code, Verify)
router.post("/logout", Logout)


export default router