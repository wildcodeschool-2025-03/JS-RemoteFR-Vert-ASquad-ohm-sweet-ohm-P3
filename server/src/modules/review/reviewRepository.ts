import databaseClient, { type Result } from "../../../database/client";

type Review = {
  id: number;
  review: string;
  grade: number;
  user_id: number;
  firstname?: string;
  lastname?: string;
  profile_pic?: string;
};

class ReviewRepository {
  async create(newReview: { user_id: number; review: string; grade: number }) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO review (user_id, review, grade) VALUES (?, ?, ?)",
      [newReview.user_id, newReview.review, newReview.grade],
    );
    return result.insertId;
  }
  async readAll() {
    const [rows] = await databaseClient.query(`
            SELECT r.id, r.review, r.grade, r.user_id, u.firstname, u.lastname, u.profile_pic
            FROM review AS r
            INNER JOIN user AS u ON r.user_id = u.id
        `);
    return rows as Review[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query(
      `
            SELECT r.id, r.review, r.grade, r.user_id, u.firstname, u.lastname, u.profile_pic
            FROM review AS r
            RIGHT JOIN user AS u ON r.user_id = u.id
            WHERE r.id = ?
        `,
      [id],
    );
    return (rows as Review[])[0] ?? null;
  }
}

export default new ReviewRepository();
