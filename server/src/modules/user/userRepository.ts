import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  hashed_password: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
};

class UserRepository {
  async create(user: Omit<User, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, email, password, car_brand, car_template, car_socket) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.lastname,
        user.email,
        user.hashed_password,
        user.car_brand,
        user.car_template,
        user.car_socket,
      ],
    );
    return result.insertId;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    return rows as User[];
  }

  async readByEmailWithPassword(email: string): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, email, password AS hashed_password FROM user WHERE email = ?",
      [email],
    );

    const user = rows[0] as User | undefined;
    return user ?? null;
  }
}

export default new UserRepository();
