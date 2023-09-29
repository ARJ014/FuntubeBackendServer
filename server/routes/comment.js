import express from "express";
import {
  addComment,
  deleteComment,
  getComment,
} from "../controllers/comments.js";
import { verifyToken } from "../verifyJWT.js";

const commentRouter = express.Router();

commentRouter.get("/get/:videoId", getComment);
commentRouter.post("/", verifyToken, addComment);
commentRouter.delete("/delete/:id", verifyToken, deleteComment);

export default commentRouter;
