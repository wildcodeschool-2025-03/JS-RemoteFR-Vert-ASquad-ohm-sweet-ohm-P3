import type { RequestHandler } from "express";
import brandRepository from "./brandRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const Brand = await brandRepository.readAll();

    res.json(Brand);
  } catch (err) {
    next(err);
  }
};

export default { browse };
