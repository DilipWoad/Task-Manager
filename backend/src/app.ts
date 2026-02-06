import express from "express";
import cookieParser from "cookie-parser";
import { GlobalErrorHandler } from "./utils/GlobalErrorHandler.js";
import cors from "cors";
import { CROSS_ORIGIN } from "./config.js";

export const app = express();

//configure express here]
app.use(
  cors({
    origin: CROSS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials:true
  })
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ limit: "20kb", extended: true }));

app.use(express.static("/public"));

app.use(cookieParser());

//Routes

import authRoute from "./routes/auth.route.js"
import taskRoute from "./routes/task.route.js";
import groupRoute from "./routes/group.route.js";
import userRoute from "./routes/user.route.js";


app.use("/api/v1/auths", authRoute);
app.use("/api/v1/tasks",taskRoute);
app.use("/api/v1/groups",groupRoute);
app.use("/api/v1/users",userRoute);


//Global Error Handles Last
app.use(GlobalErrorHandler);
