import { validationResult, matchedData } from "express-validator";
import "../../Middleware/Local_Passport.mjs"
import passport from "passport";
import db from "../../Database/DB_Connect.mjs";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../../Middleware/USER_Validators/User_Mailer.mjs"
import jwt from "jsonwebtoken"

const Login = async (req, res) => {
    try {
        const problem = validationResult(req)

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() })

        if (req.user) {
            return res.status(200).json({
                loggedin: true,
                user: req.user,
                message: "User is already logged in",
            });
        }

        passport.authenticate("local", (err, user) => {
            if (err) return res.status(500).json({ error: "Internal Server Error" })
            if (!user) return res.status(400).json({ error: "Invalid Credentials" })

            const token = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
                image: user.image,
                file_type: user.file_type,
                phone_number: user.phone_number,
                type: user.type,
            }, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("CMT", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 60 * 60 * 1000
            });

            res.json({ message: "Logged in", user });

        })(req, res)
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}


const Register = async (req, res) => {
    try {
        const problem = validationResult(req);
        const { email, password, confirmPassword } = matchedData(req);

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() });

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        const generateCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = await db.query(
            `INSERT INTO users (email, password, verification_code, code_expires_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email)
       DO UPDATE SET
         password = EXCLUDED.password,
         verification_code = EXCLUDED.verification_code,
         code_expires_at = EXCLUDED.code_expires_at
       WHERE users.is_verified = FALSE RETURNING *;`,
            [email, hashedPassword, generateCode, expires]
        );

        const user = newUser.rows[0];
        sendVerificationEmail(user.email, generateCode);

        res.json({ message: "Verification code sent to email." });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};


const Verify = async (req, res) => {
    try {
        const { email } = matchedData(req);
        const problem = validationResult(req);

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() });

        const userResult = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
        const newUser = userResult.rows[0];

        if (!newUser) return res.status(400).json({ error: "User not found" });

        await db.query(
            `UPDATE users SET is_verified = TRUE, verification_code = NULL, code_expires_at = NULL WHERE email = $1`,
            [email]
        );

        const userToken = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username,
                role: newUser.role,
                image: newUser.image,
                file_type: newUser.file_type,
                phone_number: newUser.phone_number,
                type: newUser.type,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.cookie("CMT", userToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            maxAge: 60 * 60 * 1000
        });

        res.json({ message: "Email verified! User logged in.", userToken });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

const Logout = async (req, res) => {
    try {
        res.clearCookie("CMT", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const googleLogin = function (req, res) {
    const user = req.user
    const token = jwt.sign({
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        image: user.image,
        phone_number: user.phone_number,
        is_verified: user.is_verified,
        type: user.type,
    }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("CMT", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 60 * 60 * 1000
    });
    res.redirect(`${process.env.FRONT_END_URL}`);
};




export { Login, Register, Verify, Logout, googleLogin }