import type { RequestHandler } from "express";
import terminalRepository from "./terminalRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const bbox = req.query.bbox as string;
    if (!bbox) {
      res.status(404).json();
      return;
    }

    const [southWestLng, southWestLat, northEastLng, northEastLat] = bbox
      .split(",")
      .map(Number);

    if (
      [southWestLng, southWestLat, northEastLng, northEastLat].some(
        Number.isNaN,
      )
    ) {
      res.status(404).json();
      return;
    }

    const terminals = await terminalRepository.readBbox(
      southWestLat,
      southWestLng,
      northEastLat,
      northEastLng,
    );

    res.json(terminals);
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
