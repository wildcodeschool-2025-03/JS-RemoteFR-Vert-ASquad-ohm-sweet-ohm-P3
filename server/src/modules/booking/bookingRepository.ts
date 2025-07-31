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

  async readByUserId(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      `SELECT 
        b.id, 
        b.start_time, 
        b.end_time, 
        t.nom_station, 
        t.adresse_station
     FROM booking AS b
     JOIN terminal AS t ON b.terminal_id = t.id
     WHERE b.user_id = ?
     ORDER BY b.start_time DESC`,
      [userId],
    );

    return rows;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "delete from booking where id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

export default new BookingRepository();
