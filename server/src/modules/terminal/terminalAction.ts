import type { RequestHandler } from "express";
import terminalRepository from "./terminalRepository";

const browseAll: RequestHandler = async (req, res, next) => {
  try {
    const terminals = await terminalRepository.readAll();
    res.json(terminals);
  } catch (err) {
    next(err);
  }
};
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
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Delete a specific category based on the provided ID
    const terminalId = Number(req.params.id);

    await terminalRepository.delete(terminalId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browseAll, browse, read, destroy };
