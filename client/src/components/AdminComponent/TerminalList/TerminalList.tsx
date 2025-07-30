import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./TerminalList.css";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
};

function TerminalList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    setIsFetching(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/`, {
      headers: {
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTerminals(data);
      })
      .catch((err) => console.error("Erreur :", err))
      .finally(() => setIsFetching(false));
  }, [isAuthenticated, isLoading]);

  if (isLoading) return <p>Chargement utilisateur...</p>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <section>
      <h2>Liste des bornes</h2>

      {isFetching && <p>Chargement des bornes...</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nom de la station</th>
              <th>Adresse</th>
            </tr>
          </thead>
          <tbody>
            {terminals.slice(0, visibleCount).map((t) => (
              <tr key={t.id}>
                <td>{t.nom_station}</td>
                <td>{t.adresse_station}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isFetching && visibleCount < terminals.length && (
        <div className="button-container">
          <button
            type="button"
            onClick={() => setVisibleCount(visibleCount + 10)}
          >
            Charger plus
          </button>
        </div>
      )}
    </section>
  );
}

export default TerminalList;
