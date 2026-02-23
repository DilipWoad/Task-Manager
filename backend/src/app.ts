import express from "express";
import cookieParser from "cookie-parser";
import { GlobalErrorHandler } from "./utils/GlobalErrorHandler.js";
import cors from "cors";
import { CROSS_ORIGIN } from "./config.js";
import helmet from "helmet";
import morgan from "morgan";
import { rateLimit } from "express-rate-limit";

export const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: false, //for cdn,cloud stored images etec and frontend
  }),
);
const environment: "combined" | "dev" =
  process.env.NODE_ENV === "production" ? "combined" : "dev";

app.use(morgan(environment));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);
//configure express here]
app.use(
  cors({
    origin: CROSS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "20kb" }));

app.use(express.urlencoded({ limit: "20kb", extended: true }));

app.use(express.static("/public"));

app.use(cookieParser());

//Routes

import authRoute from "./routes/auth.route.js";
import taskRoute from "./routes/task.route.js";
import groupRoute from "./routes/group.route.js";
import userRoute from "./routes/user.route.js";

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is healthy" });
});

app.use("/api/v1/auths", authRoute);
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/groups", groupRoute);
app.use("/api/v1/users", userRoute);

//route not-found error
app.use("/{*any}", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

//Global Error Handles Last
app.use(GlobalErrorHandler);

//user leaderboard not fetching,
//  group not fetching,
