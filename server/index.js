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

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    throw e;
  });

//middleware
app.use(express.static(path.join(__dirname, "/client")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});
app.use(
  cors({
    origin:
      "https://app.netlify.com/sites/jade-pithivier-700ac2/deploys/65172aaa30cc630008bb4279",
    credentials: true,
  })
);
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