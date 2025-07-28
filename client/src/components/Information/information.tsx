import { useEffect, useState } from "react";
import "../Information/information.css";

type InformationItem = {
  id: number;
  question: string;
  answer: string;
};

function Information() {
  const [informationList, setInformationList] = useState<InformationItem[]>([]);
  const [openInformationId, setOpenInformationId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    const getInformation = () => {
      fetch("http://localhost:3310/api/information/")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setInformationList(data);
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des actualités :",
            error,
          );
        });
    };

    getInformation();
  }, []);

  const handleTitleClick = (id: number) => {
    setOpenInformationId(openInformationId === id ? null : id);
  };

  return (
    <>
      <h1>FAQ</h1>
      <div className="information-container">
        <ul className="information-list">
          {informationList.map((item) => (
            <li key={item.id} className="information-item">
              <button
                type="button"
                onClick={() => handleTitleClick(item.id)}
                className="information-question"
              >
                {item.question}
              </button>
              {openInformationId === item.id && (
                <p className="information-answer">{item.answer}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
export default Information;
