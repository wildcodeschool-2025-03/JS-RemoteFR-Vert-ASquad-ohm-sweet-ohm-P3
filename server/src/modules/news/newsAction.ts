import type { RequestHandler } from "express";
import NewsRepository from "./newsRepository";
import newsRepository from "./newsRepository";

const browse: RequestHandler = async (req, res, next) => {
  try {
    const news = await NewsRepository.readAll();

    res.json(news);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const newsId = Number(req.params.id);
    const news = await NewsRepository.read(newsId);

    if (news == null) {
      res.sendStatus(404);
    } else {
      res.json(news);
    }
  } catch (err) {
    next(err);
  }
};

const edit: RequestHandler = async (req, res, next) => {
  try {
    const news = {
      id: Number(req.params.id),
      title: req.body.title,
      article: req.body.article,
      date: req.body.date,
    };

    const affectedRows = await NewsRepository.update(news);

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
    const newNews = {
      title: req.body.title,
      article: req.body.article,
      date: req.body.date,
    };

    const insertId = await newsRepository.create(newNews);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const newsId = Number(req.params.id);
    const affectedRows = await newsRepository.delete(newsId);

    if (affectedRows === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
};

export default { browse, read, edit, add, destroy };
