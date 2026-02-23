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
const listOfIp =["3.212.128.62",
"34.198.201.66",
"52.22.236.30",
"54.167.223.174",
"52.87.72.16",
"54.87.112.51",
"3.20.63.178",
"52.15.147.27",
"3.12.251.153",
"18.116.205.62",
"3.133.226.214",
"3.149.57.90",
"45.55.123.175",
"45.55.127.146",
"129.212.132.140",
"134.199.240.137",
"138.197.53.117",
"138.197.53.138",
"138.197.54.143",
"138.197.54.247",
"138.197.63.92",
"143.244.221.177",
"144.126.251.21",
"209.38.49.1",
"209.38.49.206",
"209.38.49.226",
"209.38.51.43",
"5.161.75.7",
"5.161.73.160",
"5.161.113.195",
"5.161.117.52",
"5.161.177.47",
"5.161.194.92",
"5.161.215.244",
"178.156.181.172",
"178.156.184.20",
"178.156.185.127",
"178.156.185.231",
"178.156.187.238",
"178.156.189.113",
"178.156.189.249",
"69.162.124.227",
"69.162.124.235",
"69.162.124.238",
"216.144.248.18",
"216.144.248.19",
"216.144.248.21",
"216.144.248.22",
"216.144.248.23",
"216.144.248.24",
"216.144.248.25",
"216.144.248.26",
"216.144.248.27",
"216.144.248.28",
"216.144.248.29",
"216.144.248.30",
"216.245.221.83"]
app.use(
  cors({
    origin: [CROSS_ORIGIN,"http://www.uptimerobot.com",...listOfIp],
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
