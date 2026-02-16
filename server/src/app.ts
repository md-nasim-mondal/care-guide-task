import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { envVars } from "./app/config/env";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { router } from "./app/routes";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [envVars.FRONTEND_URL, "http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to Care Guide Note App Server!",
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
