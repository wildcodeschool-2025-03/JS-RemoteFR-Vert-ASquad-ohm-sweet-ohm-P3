import type { RequestHandler } from "express";
import informationRepository from "./informationRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const information = await informationRepository.readAll();

    res.status(200).json(information);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const informationId = Number(req.params.id);
    const information = await informationRepository.read(informationId);

    if (information == null) {
      res.sendStatus(404);
    } else {
      res.status(200).json(information);
    }
  } catch (err) {
    next(err);
  }
};

/* Le code n'est pas encore implémenté. 

const edit: RequestHandler = async (req, res, next) => {
  try {
    const information = {
      id: Number(req.params.id),
      question: req.body.question,
      answer: req.body.answer,
    };

    const affectedRows = await informationRepository.update(information);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};
 */

/* Le code n'est pas encore implémenté. 

const add: RequestHandler = async (req, res, next) => {
  try {
    const newInformation = {
      question: req.body.question,
      answer: req.body.answer,
    };

    const insertId = await informationRepository.create(newInformation);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
}; */

/* Le code n'est pas encore implémenté. 

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const informationId = Number(req.params.id);
    const affectedRows = await informationRepository.delete(informationId);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
}; */

export default { read, browse };
