import bookingRepository from "./bookingRepository";

import type { RequestHandler } from "express";

import { addMinutes } from "date-fns";

const browse: RequestHandler = async (req, res) => {
  const bookings = await bookingRepository.readAll();

  res.json(bookings);
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { terminal_id, start_time, user_id } = req.body;

    if (
      !terminal_id ||
      !start_time ||
      user_id === undefined ||
      user_id === null
    ) {
      res.status(400).json({ error: "Il manque un des champs requis" });
      return;
    }

    const parsedStartTime = new Date(start_time);
    const endTime = addMinutes(parsedStartTime, 60);

    const newBooking = {
      start_time: parsedStartTime,
      end_time: endTime,
      user_id: req.body.user_id,
      terminal_id: req.body.terminal_id,
    };

    const insertId = await bookingRepository.create(newBooking);

    res
      .status(201)
      .json({ insertId, message: "Réservation créée avec succés !" });
  } catch (err) {
    next(err);
  }
};

export default { browse, add };
