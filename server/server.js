import express from "express"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import passport from "passport"
import cors from "cors"

import Users from "./src/Routes/USER_Routes.mjs"

const app = express()

app.use(bodyParser.json({ limit: "50mb" }))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieParser())

app.set('trust proxy', 1)
app.use(cors({
    origin: [
        process.env.FRONT_END_URL,
        "http://localhost:3000"
    ],
    credentials: true,
}))

app.use(passport.initialize())

app.use("/api/users/", Users)

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Port is now running on ${port}`))
