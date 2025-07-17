import userRepository from "./userRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const users = await userRepository.readAll();

  res.json(users);
};

const read: RequestHandler = async (req, res, next) => {
  const parseId = Number.parseInt(req.params.id);
  const user = await userRepository.read(parseId);
  if (user != null) {
    res.json(user);
  } else {
    res.send(404);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newUser = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      hashed_password: req.body.hashed_password,
      car_brand: req.body.car_brand,
      car_template: req.body.car_template,
      car_socket: req.body.car_socket,
      profile_pic: req.body.profile_pic,
    };

    const insertId = await userRepository.create(newUser);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
