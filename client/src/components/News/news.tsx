import { useEffect, useState } from "react";
import "../News/news.css";

type NewsItem = {
  id: number;
  title: string;
  article: string;
  date: Date;
};

function News() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);

  useEffect(() => {
    const getNews = () => {
      fetch("http://localhost:3310/api/news/")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setNewsList(data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des actualités :",
            error,
          );
        });
    };

    getNews();
  }, []);

  return (
    <>
      <h1>Actualités</h1>
      <div className="news-container">
        <ul className="news-list">
          {newsList.map((newsItem) => (
            <li key={newsItem.id} className="news-item">
              <h2 className="news-title">{newsItem.title}</h2>
              <p className="news-date">
                Date: {new Date(newsItem.date).toLocaleDateString()}
              </p>
              <p className="news-article">{newsItem.article}</p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default News;
