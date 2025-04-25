import express from "express"

import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import cors from "cors"
import pgSession from "connect-pg-simple"

import Users from "./src/Routes/USER_Routes.mjs"


const app = express()

app.use(bodyParser.json({limit: "50mb"}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(session({
    name: "NODED",
    secret: process.env.SECRET_SESSION,
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(cors({
    origin: [
        `${process.env.CLIENT_URL}`,
        "http://localhost:3000"
    ],
    credentials: true,
}))


app.use("/api/users/", Users)


const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Port is now running on ${port}`))