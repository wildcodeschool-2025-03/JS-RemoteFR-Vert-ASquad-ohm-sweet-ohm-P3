import databaseClient from "../../../../database/client";

type Review = {
  id: number;
  review: string;
  grade: number;
  user_id: number;
  firstname: string;
  lastname: string;
  profile_pic: string;
};

class ReviewRepository {
  async readAll() {
    const [rows] = await databaseClient.query(`
            SELECT r.id, r.review, r.grade, r.user_id, u.firstname, u.lastname, u.profile_pic
            FROM review AS r
            JOIN user AS u ON r.user_id = u.id
        `);
    return rows as Review[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query(
      `
            SELECT r.id, r.review, r.grade, r.user_id, u.firstname, u.lastname, u.profile_pic
            FROM review AS r
            JOIN user AS u ON r.user_id = u.id
            WHERE r.id = ?
        `,
      [id],
    );
    return (rows as Review[])[0] ?? null;
  }
}

export default new ReviewRepository();
