import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type news = {
  id: number;
  title: string;
  article: string;
  date: Date;
};

class NewsRepository {
  async readAll() {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM news ORDER BY date DESC LIMIT 3",
    );

    return rows as news[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM news WHERE id = ?",
      [id],
    );

    return rows[0] as news;
  }

  /* Le code n'est pas encore implémenté.
  
  async update(news: news) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE news SET title = ?, article = ?, date = ? WHERE id = ?",
      [news.title, news.article, news.date, news.id],
    );

    return result.affectedRows;
  } */

  /* Le code n'est pas encore implémenté. 
 
 async create(news: Omit<news, "id">) {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO news (title, article, date) VALUES (?, ?, ? )",
      [news.article, news.title, news.date],
    );
    return result.insertId;
  } */

  /* Le code n'est pas encore implémenté. 

async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM news WHERE id = ?",
      [id],
    );

    return result.affectedRows;
  } */
}
export default new NewsRepository();
