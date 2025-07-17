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

const edit: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).send("ID invalide");
      return;
    }

    const review = {
      id: id,
      user_id: req.body.user_id,
      review: req.body.review,
      grade: req.body.grade,
    };

    const affectedRows = await reviewRepository.update(review);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newReview = {
      user_id: req.body.user_id,
      review: req.body.review,
      grade: req.body.grade,
    };

    const insertId = await reviewRepository.create(newReview);

    res.status(201).json({ id: insertId });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const reviewId = Number(req.params.id);
    const deletedCount = await reviewRepository.delete(reviewId);

    if (deletedCount === 0) {
      res.status(404).json({ message: "Avis introuvable" });
      return;
    }

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, edit, destroy };
