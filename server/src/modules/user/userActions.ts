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
      birthdate: req.body.birthdate,
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

const edit: RequestHandler = async (req, res, next) => {
  try {
    const idFromParams = +req.params.id; // Id de la route donnée par l'uri /api/users/33 => Libre
    const idFromAuth = +req.auth.sub; // Id de la connexion, id user en BDD => Admin 1

    // 🛡️ Authentification manquante
    if (!idFromAuth) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    // ❌ Accès interdit à un autre utilisateur, si en dehors de l'admin
    if (idFromAuth !== idFromParams && idFromAuth !== 1) {
      res.status(403).json({ message: "Accès refusé" });
      return;
    }

    const {
      firstname,
      lastname,
      email,
      birthdate,
      profile_pic,
      car_brand,
      car_template,
      car_socket,
      role_id,
    } = req.body;

    const affectedRows = await userRepository.update(idFromParams, {
      firstname,
      lastname,
      email,
      birthdate,
      profile_pic,
      car_brand,
      car_template,
      car_socket,
      role_id,
      id: 0,
      hashed_password: "",
    });

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};
const destroy: RequestHandler = async (req, res, next) => {
  try {
    // Delete a specific category based on the provided ID
    const userId = Number(req.params.id);

    await userRepository.delete(userId);

    // Respond with HTTP 204 (No Content) anyway
    res.sendStatus(204);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, add, read, edit, destroy };
