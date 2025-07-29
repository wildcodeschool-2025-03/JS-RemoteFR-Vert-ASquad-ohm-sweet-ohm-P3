import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type information = {
  id: number;
  question: string;
  answer: string;
};

class InformationRepository {
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "select * from information",
    );

    return rows as information[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "select * from information where id = ?",
      [id],
    );

    return rows[0] as information;
  }

  /* Le code n'est pas encore implémenté. 
  
  async update(information: information) {
    const [result] = await databaseClient.query<Result>(
      "update information set question = ? , answer = ? where id = ?",
      [information.question, information.answer, information.id],
    );

    return result.affectedRows;
  } */

  /* Le code n'est pas encore implémenté.
  
  async create(information: Omit<information, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO information (question, answer) VALUES (?, ?)",
      [information.question, information.answer],
    );
    return result.insertId;
  }
 */
  /* Le code n'est pas encore implémenté.  
  
  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM information WHERE id = ?",
      [id],
    );

    return result.affectedRows;
  } */
}

export default new InformationRepository();
