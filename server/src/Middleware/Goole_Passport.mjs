import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import db from "../Database/DB_Connect.mjs";

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.NODE_ENV === 'production'
        ? `https://asd-be.onrender.com/api/users/auth/google/callback`
        : "http://localhost:5000/api/users/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, cb) {
        try {
            const email = profile.emails?.[0].value;
            const image = profile.photos?.[0]?.value;
            const username = profile.displayName;
            const provider = profile.provider
            const googleId = profile.id;
            const google_verified = profile.email_verified
            const checkUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
            
            if (checkUser.rowCount === 0) {

                const newUser = await db.query(`INSERT INTO users (email, username, is_verified, password, type, google_image, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                    [email, username, google_verified, googleId, provider, image, "client"]);

                const user = {
                    id: newUser.rows[0].id,
                    email: newUser.rows[0].email,
                    username: newUser.rows[0].username,
                    image: newUser.rows[0].google_image,
                    role: newUser.rows[0].role,
                    phone_number: newUser.rows[0].phone_number,
                    is_verified: newUser.rows[0].is_verified,
                    type: newUser.rows[0].type
                };
                return cb(null, user);
            }

            const user = {
                id: checkUser.rows[0].id,
                email: checkUser.rows[0].email,
                username: checkUser.rows[0].username,
                image: checkUser.rows[0].google_image,
                role: checkUser.rows[0].role,
                phone_number: checkUser.rows[0].phone_number,
                is_verified: checkUser.rows[0].is_verified,
                type: checkUser.rows[0].type,
            };
            return cb(null, user);

        } catch (err) {
            return cb(err);
        }
    }));
