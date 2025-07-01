import bookingRepository from "./bookingRepository";

import type { RequestHandler } from "express";

const browse: RequestHandler = async (req, res) => {
  const bookings = await bookingRepository.readAll();

  res.json(bookings);
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newBooking = {
      payment: req.body.payment,
      date: req.body.date,
      booking_number: req.body.booking_number,
    };

    const insertId = await bookingRepository.create(newBooking);

    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, add };
