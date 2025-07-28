import bookingRepository from "./bookingRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const bookings = await bookingRepository.readAll();

  res.json(bookings);
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const { terminal_id, start_time, end_time, user_id } = req.body;

    const newBooking = {
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      user_id,
      terminal_id,
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
