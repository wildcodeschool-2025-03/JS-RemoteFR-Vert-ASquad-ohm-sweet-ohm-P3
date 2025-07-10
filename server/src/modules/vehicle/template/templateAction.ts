import type { RequestHandler } from "express";
import templateRepository from "./templateRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const Template = await templateRepository.read();

    res.json(Template);
  } catch (err) {
    next(err);
  }
};

export default { browse };
