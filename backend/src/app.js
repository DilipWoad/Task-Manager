import express from "express";
import cookieParser from "cookie-parser"
import { GlobalErrorHandler } from "./utils/GlobalErrorHandler.js";

export const app = express();

//configure express here]
app.use(express.json({limit:"20kb"}))

app.use(express.urlencoded({limit:"20kb",extended:true}))

app.use(express.static('/public'))

app.use(cookieParser);

//Routes



//Global Error Handles Last
app.use(GlobalErrorHandler);