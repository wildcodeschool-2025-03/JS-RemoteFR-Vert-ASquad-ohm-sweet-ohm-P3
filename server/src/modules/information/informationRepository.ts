import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type information = {
  id: number;
  question: string;
  answer: string;
};

class InformationRepository {
  async readAll() {
    // Execute the SQL SELECT query to retrieve all items from the "item" table
    const [rows] = await databaseClient.query<Rows>(
      "select * from information",
    );

    // Return the array of items
    return rows as information[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from information where id = ?",
      [id],
    );

    return rows[0] as information;
  }

  async update(information: information) {
    const [result] = await databaseClient.query<Result>(
      "update information set question = ? , answer = ? where id = ?",
      [information.question, information.answer, information.id],
    );

    // Return how many rows were affected
    return result.affectedRows;
  }

  async create(information: Omit<information, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO information (question, answer) VALUES (?, ?)",
      [information.question, information.answer],
    );
    return result.insertId;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM information WHERE id = ?",
      [id],
    );

    return result.affectedRows;
  }
}

export default new InformationRepository();
