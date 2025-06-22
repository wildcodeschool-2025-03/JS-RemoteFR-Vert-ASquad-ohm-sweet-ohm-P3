import type { RequestHandler } from "express";
import reviewRepository from "./reviewRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const reviewFromDB = await reviewRepository.readAll();

    res.json(reviewFromDB);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  const parseId = Number.parseInt(req.params.id);
  const review = await reviewRepository.read(parseId);
  if (review != null) {
    res.json(review);
  } else {
    res.send(404);
  }
};

export default { browse, read };
