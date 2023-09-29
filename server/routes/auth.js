import express from "express";
import { google, signin, signup } from "../controllers/auth.js";

const authRouter = express.Router();

authRouter.post("/signin", signin);
authRouter.post("/signup", signup);
authRouter.post("/google", google);

export default authRouter;
