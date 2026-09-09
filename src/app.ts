import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import { env, isProd } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { globalLimiter } from "./middleware/rateLimiter";
import apiRoutes from "./routes";

const app = express();

if (isProd) {
  app.set("trust proxy", 1);
}

app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(hpp());
app.use(morgan(isProd ? "combined" : "dev"));
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    status: "ok",
    env: env.NODE_ENV,
    uptime: process.uptime(),
  });
});

app.use("/v1", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
