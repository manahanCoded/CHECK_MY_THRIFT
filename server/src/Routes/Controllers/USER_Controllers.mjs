import { validationResult, matchedData } from "express-validator";
import "../../Middleware/Local_Passport.mjs"
import passport from "passport";
import db from "../../Database/DB_Connect.mjs";
import bcrypt from "bcrypt"

const Login = async (req, res) => {
    try {
        const problem = validationResult(req)

        if (!problem.isEmpty()) return res.status(400).json({ error: problem.array() })

        if (req.isAuthenticated()) return res.status(300).json({
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
                    message: "User Successfully loggedin"
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

        const checkEmail = await db.query("SELECT * from users WHERE email = $1", [email])
        if (checkEmail.rowCount > 0) return res.status(400).json({ error: "Email is already used" })

        if (password !== confirmPassword) return res.status(400).json({ error: "Confirm Password failed" })
        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS))

        const newUser = await db.query("INSERT INTO USERS (email, password) VALUES ($1, $2) RETURNING *", [email, hashedPassword])
        const user = newUser.rows[0]

        req.login(user, (error) => {

            if (error) return res.status(500).json({ error: "Interal Server Error" })

            return res.status(200).json({
                loggedin: true,
                user: { id: user.id, email: user.email },
                message: "User Successfully Registered"
            })
        })

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" })
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


export { Login, Register, Logout }