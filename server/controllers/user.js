import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.user.id);
      res.status(200).json("USer has been deleted");
    } catch (e) {
      next(e);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

export const like = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { likes: userId },
      $pull: { dislikes: userId },
    });
    res.status(200).json("The video has been liked.");
  } catch (e) {
    next(e);
  }
};

export const dislike = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Video.findByIdAndUpdate(req.params.videoId, {
      $addToSet: { dislikes: userId },
      $pull: { likes: userId },
    });
    res.status(200).json("The video has been disliked.");
  } catch (e) {
    next(e);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $addToSet: { subscribedUsers: req.params.id },
      },
      { new: true }
    );
    console.log(req.user.id);
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: 1 } });
    res.status(200).json("Subscription Succesfull");
  } catch (e) {
    next(e);
  }
};

export const unsubscribe = async (req, res, next) => {
  try {
    User.findByIdAndUpdate(req.user.id, {
      $pull: { subscribedUsers: req.params.id },
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { subscribers: -1 } });
    res.status(200).json("Subscription Succesfull");
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
};
