import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Booking = {
  id: number;
  payment: number;
  date: Date;
  booking_number: number;
};

class BookingRepository {
  async create(booking: Omit<Booking, "id">) {
    const [result] = await databaseClient.query<Result>(
      "insert into booking (payment, date, booking_number) values (?, ?, ?)",
      [booking.payment, booking.date, booking.booking_number],
    );
    return result.insertId;
  }

  async readAll(bookingId?: number) {
    const [rows] = await databaseClient.query<Rows>("select * from booking");
    return rows as Booking[];
  }
}

export default new BookingRepository();
