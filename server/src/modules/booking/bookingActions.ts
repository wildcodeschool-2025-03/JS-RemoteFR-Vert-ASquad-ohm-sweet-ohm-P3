import bookingRepository from "./bookingRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const bookings = await bookingRepository.readAll();

  res.json(bookings);
};

const readByUserId: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.userId);
    const bookings = await bookingRepository.readByUserId(userId);
    res.json(bookings);
  } catch (err) {
    next(err);
  }
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

const destroy: RequestHandler = async (req, res, next) => {
  try {
    const bookingId = Number(req.params.id);

    await bookingRepository.delete(bookingId);

    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
};

export default { browse, readByUserId, add, destroy };
