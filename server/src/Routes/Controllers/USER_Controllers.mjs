import { validationResult, matchedData } from "express-validator";
import "../../Middleware/Local_Passport.mjs"
import passport from "passport";
import db from "../../Database/DB_Connect.mjs";
import bcrypt from "bcrypt"
import { sendVerificationEmail } from "../../Middleware/USER_Validators/User_Mailer.mjs"

const Login = async (req, res) => {
    try {
        const problem = validationResult(req)

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() })

        if (req.isAuthenticated()) return res.status(200).json({
            loggedin: true,
            user: { id: req.user.id, email: req.user.email },
            message: "User is already logged in"
        })

        passport.authenticate("local", (err, user) => {
            if (err) return res.status(500).json({ error: "Internal Server Error" })
            if (!user) return res.status(400).json({ error: "Invalid Credentials" })

            req.login(user, (error) => {
                if (error) return res.status(500).json({ error: "Internal Server Error" })
                return res.status(200).json({
                    loggedin: true,
                    user: { id: user.id, email: user.email },
                    message: "User Successfully logged in"
                })
            })
        })(req, res)
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const Register = async (req, res) => {

    try {
        const problem = validationResult(req)
        const { email, password, confirmPassword } = matchedData(req)

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() })

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        const generateCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        const newUser = await db.query(`INSERT INTO users (email, password, verification_code, code_expires_at)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email)
            DO UPDATE SET
            password = EXCLUDED.password,
            verification_code = EXCLUDED.verification_code,
            code_expires_at = EXCLUDED.code_expires_at
            WHERE users.is_verified = FALSE RETURNING *;`, [email, hashedPassword, generateCode, expires])
        const user = newUser.rows[0]

        req.login(user, (error) => {
            if (error) return res.status(500).json({ error: "Login failed Internal Server Error" });
            sendVerificationEmail(user.email, generateCode)
            res.json({ message: 'Verification code sent to email.' });
        });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
}

const Verify = async (req, res) => {

    try {
        const { email } = matchedData(req);
        const problem = validationResult(req)

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() })

        await db.query(
            `UPDATE users SET is_verified = TRUE, verification_code = NULL, code_expires_at = NULL WHERE email = $1`,
            [email]
        );

        res.status(200).json({ message: 'Email verified! User has been logged in.' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}

const Logout = async (req, res) => {
    try {
        if (!req.user) return res.status(400).json({ error: "No user is logged in" })

        req.logout((error) => {
            if (error) return res.status(500).json({ error: "Interal Server Error" })

            req.session.destroy((error) => {
                if (error) return res.status(500).json({ error: "Interal Server Error" })

                return res.status(200).json({ message: "Logout successfull" });
            })
        })
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" })
    }
}


export { Login, Register, Verify, Logout }