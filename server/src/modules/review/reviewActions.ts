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
    res.status(404);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const userIdFromToken = req.auth?.sub;
    if (!userIdFromToken) {
      res.sendStatus(401);
      return;
    }

    const newReview = {
      user_id: +userIdFromToken,
      profile_pic: req.body.profile_pic,
      review: req.body.review,
      grade: req.body.grade,
    };

    const insertId = await reviewRepository.create(newReview);

    res.status(201).json({ id: insertId });
  } catch (err) {
    console.error("Erreur création review :", err);
    res.status(500);
  }
};

export default { browse, read, add };
