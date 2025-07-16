import type { RequestHandler } from "express";
import templateRepository from "./templateRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const brandId = Number.parseInt(req.params.brandId as string, 10);
    const template = await templateRepository.readByBrandId(brandId);

    res.status(200).json(template);
  } catch (err) {
    next(err);
  }
};

export default { browse };
