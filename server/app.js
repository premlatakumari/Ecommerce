import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./models/user.model.js";
import authRouter from "./routes/auth.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

export const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// Health check endpoint
app.get("/api/v1/test", (req, res) => {
  res.json({
    success: true,
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    cookies: req.cookies
  });
});