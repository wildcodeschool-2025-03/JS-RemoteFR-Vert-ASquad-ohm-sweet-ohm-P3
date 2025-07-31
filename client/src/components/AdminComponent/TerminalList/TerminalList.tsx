import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import "./TerminalList.css";
import TerminalInfo from "../TerminalInfo/TerminalInfo";

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

    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/`, {})
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur réseau");
        }
        return res.json();
      })
      .then((data) => {
        setTerminals(data);
      })
      .catch((err) => console.error("Erreur :", err))
      .finally(() => setIsFetching(false));
  }, [isAuthenticated, isLoading]);

  const handleDelete = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setTerminals((prev) => prev.filter((u) => u.id !== id));
        toast.success("Borne supprimé !");
      })
      .catch(() => toast.error("Erreur lors de la suppression"));
  };

  if (isLoading) return <p>Chargement de la borne...</p>;
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
              <th>Actions</th>{" "}
            </tr>
          </thead>
          <tbody>
            {terminals.slice(0, visibleCount).map((t) => (
              <TerminalInfo
                key={t.id}
                nom_station={t}
                onDelete={handleDelete}
              />
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
