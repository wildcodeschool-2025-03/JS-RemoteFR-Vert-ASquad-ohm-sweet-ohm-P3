import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  birthdate: string;
  hashed_password: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  role_id: number;
  profile_pic: string;
};

type UserUpdate = {
  firstname: string;
  lastname: string;
  email: string;
  birthdate: string;
  hashed_password: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  role_id: number;
};

class UserRepository {
  async create(user: Omit<User, "id" | "role_id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (firstname, lastname, email, password, car_brand, car_template, car_socket, profile_pic) VALUES (?,?, ?, ?, ?, ?, ?, ?)",
      [
        user.firstname,
        user.lastname,
        user.email,
        user.hashed_password,
        user.car_brand,
        user.car_template,
        user.car_socket,
        user.profile_pic,
      ],
    );
    return result.insertId;
  }

  async read(id: number): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, firstname, lastname, email, role_id, car_brand, car_template, car_socket, profile_pic FROM user WHERE id = ?",
      [id],
    );
    const user = rows[0] as User | undefined;
    return user ?? null;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    return rows as User[];
  }

  // Recupere un utilisateur apr son ID
  async readById(id: number): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, firstname, lastname, email, birthdate, car_brand, car_template, car_socket FROM user WHERE id = ?",
      [id],
    );

    const user = rows[0] as User | undefined;
    return user ?? null;
  }

  async readByEmailWithPassword(email: string): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, firstname, lastname, email, role_id, password AS hashed_password FROM user WHERE email = ?",
      [email],
    );

    const user = rows[0] as User | undefined;
    return user ?? null;
  }
}

export default new UserRepository();
