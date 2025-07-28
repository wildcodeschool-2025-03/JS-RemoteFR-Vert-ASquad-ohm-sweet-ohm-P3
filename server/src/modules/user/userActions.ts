import userRepository from "./userRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const users = await userRepository.readAll();

  res.json(users);
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      birthday: req.body.birthday,
      hashed_password: req.body.hashed_password,
      car_brand: req.body.car_brand,
      car_template: req.body.car_template,
      car_socket: req.body.car_socket,
    };

    const insertId = await userRepository.create(newUser);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const user = await userRepository.readById(id);

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const idFromParams = Number(req.params.id);
    const idFromAuth = Number(req.auth.sub);

    if (!idFromAuth) {
      res.status(401);
      return;
    }

    if (idFromAuth !== idFromParams) {
      res.status(403);
      return;
    }

    const { firstname, lastname, email, birthdate } = req.body;

    await userRepository.update(idFromParams, {
      firstname,
      lastname,
      email,
      birthdate,
    });

    res.status(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, add, read, update };
