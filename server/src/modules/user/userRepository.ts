import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  gender: string;
  birthdate: Date;
  email: string;
  city: string;
  postcode: number;
  number_of_electric_car: number;
  username: string;
  hashed_password: string;
  profile_pic: string;
  role_id: number;
};

class UserRepository {
  async create(user: Omit<User, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, gender, birthdate, email, city, postcode, number_of_electric_car, username, password, profile_pic, role_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.lastname,
        user.gender,
        user.birthdate,
        user.email,
        user.city,
        user.postcode,
        user.number_of_electric_car,
        user.username,
        user.hashed_password,
        user.profile_pic,
        user.role_id,
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
