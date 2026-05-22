import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";

import {errorMiddleware }from "./src/shared/middleware/error.middleware.js";
import { globalLimiter } from "./src/shared/middleware/rateLimiter.js";

import clientRoutes from "./src/modules/client/auth/client.routes.js";
import lawyerRoutes from "./src/modules/lawyer/auth/lawyer.routes.js"
import adminRoutes from "./src/modules/admin/auth/admin.routes.js";
import caseRoutes from "./src/modules/client/caseRegisterForm/case.routes.js";
import lawyersRoutes from "./src/modules/client/selectLawyer/routes.js";
import chatRoutes from "./src/modules/client/chat/chat.routes.js";
import profileRoutes from "./src/modules/client/profile/profile.routes.js";
const app = express();


app.use(helmet());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser());
app.use(globalLimiter);



app.get("/", (req, res) => {
  res.send("API is running...");
});


app.use("/api/client", clientRoutes);
app.use("/api/case",caseRoutes);
app.use("/api/lawyers", lawyersRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/client/details",profileRoutes)
app.use("/api/lawyer",lawyerRoutes);
app.use("/api/admin",adminRoutes);
app.use(errorMiddleware);


app.use((err, req, res, next) => {
  console.error("ERROR:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });
});

export default app;