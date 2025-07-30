import userRepository from "./userRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const users = await userRepository.readAll();

  res.json(users);
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const parseId = Number.parseInt(req.params.id);
    const user = await userRepository.read(parseId);

    if (user != null) {
      res.json(user);
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (err) {
    next(err);
  }
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
      profile_pic: req.body.profile_pic,
    };

    const insertId = await userRepository.create(newUser);

    res.status(200).json({ insertId });
  } catch (err) {
    next(err);
  }
};

const update: RequestHandler = async (req, res, next) => {
  try {
    const idFromParams = Number(req.params.id);

    const {
      firstname,
      lastname,
      email,
      birthdate,
      car_brand,
      car_template,
      car_socket,
    } = req.body;

    const result = await userRepository.update(idFromParams, {
      firstname,
      lastname,
      email,
      birthdate,
      car_brand,
      car_template,
      car_socket,
    });

    res.sendStatus(204);
  } catch (err) {
    res.status(500);
  }
};

export default { browse, add, read, update };
