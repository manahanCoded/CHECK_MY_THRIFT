import { Router } from "express";
import { Login, Register, Logout, Verify, googleLogin } from "./Controllers/USER_Controllers.mjs";
import { Validate_Login, Validate_Register, Validate_Code } from "../Middleware/USER_Validators/USER_Validators.mjs";
import userLoggin from "../Middleware/USER_Validators/LoggedUser.mjs";
import {AuthenticateJWT} from "../Middleware/AuthenticateUsers.mjs";
import "../Middleware/Goole_Passport.mjs"
import passport from "passport";

const router = Router()

router.post("/login", userLoggin, Validate_Login, Login)

router.post("/register", Validate_Register, Register)

router.post("/verify", Validate_Code, Verify)

router.post("/logout", Logout)

router.get("/profile", AuthenticateJWT, (req, res) => {
    res.json({ user: req.user });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', "email"] }))
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: `${process.env.FRONT_END_URL}`, session: false }), googleLogin)

export default router