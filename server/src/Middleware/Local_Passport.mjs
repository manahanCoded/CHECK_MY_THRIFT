import { Strategy } from "passport-local";
import passport from "passport";
import db from "../Database/DB_Connect.mjs";
import bcrypt from "bcrypt"




passport.use("local", new Strategy({ usernameField: "email", passwordField: "password" },
    async (username, password, done) => {
        try {
            const getUser = await db.query("SELECT * FROM users where email = $1", [username])

            if (getUser.rowCount === 0) return done(null, false, { message: "Email not found." })

            const user = getUser.rows[0]
            const userPassword = user.password

             bcrypt.compare(password, userPassword, (err, isMatched) => {
                if (err) return done(err, false, { error: "Internal Server Error" })
                if (!isMatched) return done(null, false, { message: "Password incorrect" })
                return done(null, user)
            })

        } catch (err) {
            return done(err, false, { error: "Internal Server Error" })
        }
    }
))


passport.serializeUser((user, done) => {
    return done(null, user.id)
})


passport.deserializeUser(async (userID, done) => {
    try{
        const verifyUser = await db.query("SELECT * from users where id = $1", [userID])
        if(verifyUser.rowCount === 0) return done(null, false)

        return done (null, verifyUser.rows[0])

    }catch (err) {
            return done(err, false, { error: "Internal Server Error" })
    }
})