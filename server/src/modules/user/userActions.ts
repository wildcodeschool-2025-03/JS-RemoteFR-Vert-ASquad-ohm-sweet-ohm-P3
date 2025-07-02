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
      gender: req.body.gender,
      birthdate: req.body.birthdate,
      email: req.body.email,
      city: req.body.city,
      postcode: req.body.postcode,
      number_of_electric_car: req.body.number_of_electric_car,
      username: req.body.username,
      hashed_password: req.body.hashed_password,
      profile_pic: req.body.profile_pic,
      role_id: req.body.role_id,
      vehicle_user: req.body.vehicle_user,
      vehicle_socket: req.body.vehicle_socket,
    };

    const insertId = await userRepository.create(newUser);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, add };
