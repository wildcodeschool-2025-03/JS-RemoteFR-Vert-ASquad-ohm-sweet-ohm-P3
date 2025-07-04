import type { RequestHandler } from "express";
import terminalRepository from "./terminalRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const Terminal = await terminalRepository.readAll();

    res.json(Terminal);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const terminalId = Number(req.params.id);
    const terminal = await terminalRepository.read(terminalId);

    if (terminal == null) {
      res.sendStatus(404);
    } else {
      res.json(terminal);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read };
