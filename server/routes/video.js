import express from "express";
import { verifyToken } from "../verifyJWT.js";
import {
  addVideo,
  deleteVideo,
  updateVideo,
  addView,
  getVideo,
  random,
  subscribe,
  trend,
  getByTag,
  search,
} from "../controllers/video.js";
const videoRouter = express.Router();

videoRouter.post("/", verifyToken, addVideo);
videoRouter.put("/:id", verifyToken, updateVideo);
videoRouter.delete("/:id", verifyToken, deleteVideo);
videoRouter.get("/find/:id", getVideo);
videoRouter.put("/view/:id", addView);
videoRouter.get("/trend", trend);
videoRouter.get("/random", random);
videoRouter.get("/sub", verifyToken, subscribe);
videoRouter.get("/tags", getByTag);
videoRouter.get("/search", search);
export default videoRouter;
