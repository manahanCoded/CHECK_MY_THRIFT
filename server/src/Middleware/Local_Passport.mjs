import { Strategy } from "passport-local";
import passport from "passport";
import db from "../Database/DB_Connect.mjs";
import bcrypt from "bcrypt"



passport.use("local", new Strategy({ usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
        try {
            const getUser = await db.query("SELECT * FROM users where email = $1", [email])

            if (getUser.rowCount === 0) return done(null, false, { message: "Email not found." })

            const user = getUser.rows[0]
            const userPassword = user.password

            bcrypt.compare(password, userPassword, (err, isMatched) => {
                if (err) return done(err, false, { error: "Internal Server Error" })
                if (!isMatched) return done(null, false, { message: "Password incorrect" })

                const safeUser = {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    phone_number: user.phone_number,
                    role: user.role,
                    image: user.image,
                    file_type: user.file_mime_type,
                    is_verified: user.is_verified,
                };


                return done(null, safeUser)
            })

        } catch (err) {
            return done(err, false, { error: "Internal Server Error" })
        }
    }
))

