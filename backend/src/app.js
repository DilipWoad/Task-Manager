import express from "express";
import cookieParser from "cookie-parser"
import { GlobalErrorHandler } from "./utils/GlobalErrorHandler.js";

export const app = express();

//configure express here]
app.use(express.json({limit:"20kb"}))

app.use(express.urlencoded({limit:"20kb",extended:true}))

app.use(express.static('/public'))

app.use(cookieParser);

app.get('/',(req,res)=>{
    res.send("Hello IT WORKING//")
})
//Routes

import authRoute from "./routes/auth.route.js"
app.use('/api/v1/auths',authRoute);

//Global Error Handles Last
app.use(GlobalErrorHandler);