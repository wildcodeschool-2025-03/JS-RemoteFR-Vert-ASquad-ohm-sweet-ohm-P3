import type { RequestHandler } from "express";
import brandRepository from "./brandRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const brand = await brandRepository.readAll();

    res.status(200).json(brand);
  } catch (err) {
    next(err);
  }
};

export default { browse };
