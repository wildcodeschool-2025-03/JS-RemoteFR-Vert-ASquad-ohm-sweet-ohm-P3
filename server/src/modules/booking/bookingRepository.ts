import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Booking = {
  id: number;
  start_time: Date;
  end_time: Date;
  user_id: number;
  terminal_id: number;
};

class BookingRepository {
  async create(booking: Omit<Booking, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO booking (start_time, end_time, user_id, terminal_id) values (?, ?, ?, ?)",
      [
        booking.start_time,
        booking.end_time,
        booking.user_id,
        booking.terminal_id,
      ],
    );
    return result.insertId;
  }

  async readAll(bookingId?: number) {
    const [rows] = await databaseClient.query<Rows>("select * from booking");
    return rows as Booking[];
  }
}

export default new BookingRepository();
