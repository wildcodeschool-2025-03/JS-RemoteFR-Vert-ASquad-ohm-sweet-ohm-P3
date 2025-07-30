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
  const [terminal, setTerminal] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credential: "includes",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTerminal(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur dans fetch:", error);
        setLoading(false);
      });
  }, []);

  if (isLoading || loading) return <div>Chargement...</div>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <section className="user-table-section">
      <h2>Liste des bornes</h2>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nom de la station</th>
              <th>Adresse</th>
            </tr>
          </thead>
          <tbody>
            {terminal.map((t) => (
              <tr key={t.id}>
                <td>{t.nom_station}</td>
                <td>{t.adresse_station}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TerminalList;
