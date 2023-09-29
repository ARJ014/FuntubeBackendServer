import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const addVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    const saveVideo = await newVideo.save();
    res.status(200).json(saveVideo);
  } catch (e) {
    return next(e);
  }
};

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not Found"));

    if (req.user.id === video.userId) {
      const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedVideo);
    } else {
      return next(createError(403, "You cannot update this video"));
    }
  } catch (e) {
    return next(e);
  }
};

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return next(createError(404, "Video not Found"));

    if (req.user.id === video.userId) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json("Video deleted");
    } else {
      return next(createError(403, "You cannot delete this video"));
    }
  } catch (e) {
    return next(e);
  }
};

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch (e) {
    return next(e);
  }
};

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.status(200).json("View Increased");
  } catch (e) {
    return next(e);
  }
};

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch (e) {
    return next(e);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch (e) {
    return next(e);
  }
};

export const subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedList = user.subscribedUsers;
    const videos = await Promise.all(
      subscribedList.map(async (userId) => await Video.find({ userId }))
    );
    res
      .status(200)
      .json(videos.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch (e) {
    return next(e);
  }
};

export const getByTag = async (req, res, next) => {
  try {
    const tags = req.query.tags.split(",");
    const videos = await Video.find({ tags: { $in: tags } }).sort({
      views: -1,
    });
    res.status(200).json(videos);
  } catch (e) {
    return next(e);
  }
};

export const search = async (req, res, next) => {
  try {
    const query = req.query.q;
    const videos = await Video.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { desc: { $regex: query, $options: "i" } },
        { tags: { $in: query.split(" ") } },
      ],
    }).sort({ views: -1 });
    res.status(200).json(videos);
  } catch (e) {
    return next(e);
  }
};
