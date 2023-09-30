import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/users.js";
import videoRouter from "./routes/video.js";
import commentRouter from "./routes/comment.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(
  cors({ origin: ["http://localhost:3000","https://frontfuntube.netlify.app"], credentials: true })
);
mongoose
  .connect(
    "mongodb+srv://arjun:arjun@cluster0.j0l6twi.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    throw e;
  });

//middleware

app.use(express.json());
app.use(cookieParser());
//routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/video", videoRouter);
app.use("/api/comment", commentRouter);

//error handling
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Error has occured";
  return res.status(status).json({
    status,
    message,
  });
});

app.listen(8800, () => {
  console.log(`Listening on server `);
});
