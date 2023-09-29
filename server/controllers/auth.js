import bcrypt from "bcrypt";
import User from "../models/User.js";
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

//Signing Up the user
export const signup = async (req, res, next) => {
  try {
    const hashpassword = await bcrypt.hash(req.body.password, 8);
    const user = new User({ ...req.body, password: hashpassword });
    const saveduser = await user.save();
    const accesToken = jwt.sign({ id: saveduser._id }, process.env.JWT);
    const { password, ...others } = saveduser._doc; // This is to remove password from our response

    res
      .cookie("access_token", accesToken, { httpOnly: true })
      .status(200)
      .json(others);
    res.status(200).send("User Created succesfully  ");
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// Signing in the user
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "Email not registered"));
    const result = await bcrypt.compare(req.body.password, user.password);
    if (!result) return next(createError(400, "Wrong Password"));

    const accesToken = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc; // This is to remove password from our response

    res
      .cookie("access_token", accesToken, { httpOnly: true })
      .status(200)
      .json(others);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const accesToken = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", accesToken, { httpOnly: true })
        .status(200)
        .json(user._doc);
    } else {
      const newuser = new User({ ...req.body, fromGoogle: true });
      const saveduser = await newuser.save();
      const accesToken = jwt.sign({ id: saveduser._id }, process.env.JWT);
      res
        .cookie("access_token", accesToken, { httpOnly: true })
        .status(200)
        .json(saveduser._doc);
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
