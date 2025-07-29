import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import "./TerminalList.css";
import TerminalInfo from "../AdminComponent/TerminalList/TerminalInfo/TerminalInfo";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
};

function TerminalList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [displayed, setDisplayed] = useState<Terminal[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const [editId, setEditId] = useState<number | null>(null);
  const [nomStationEdit, setNomStationEdit] =
    useState<Partial<Terminal> | null>(null);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTerminals(data);
        setDisplayed(data.slice(0, perPage));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur dans fetch:", error);
        setLoading(false);
      });
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = 0;
    const end = nextPage * perPage;
    setDisplayed(terminals.slice(start, end));
    setPage(nextPage);
  };

  const handleEdit = () => {
    if (!nomStationEdit) return;
    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nomStationEdit),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setTerminals((prev) =>
          prev.map((t) => (t.id === editId ? { ...t, ...nomStationEdit } : t)),
        );
        setDisplayed((prev) =>
          prev.map((t) => (t.id === editId ? { ...t, ...nomStationEdit } : t)),
        );
        setEditId(null);
        setNomStationEdit(null);
        toast.success("Borne mise à jour !");
      })
      .catch(() => {
        toast.error("Erreur lors de la mise à jour");
      });
  };

  const handleDelete = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/terminals/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        const newTerminals = terminals.filter((u) => u.id !== id);
        setTerminals(newTerminals);
        setDisplayed(newTerminals.slice(0, page * perPage));
        toast.success("Borne supprimée !");
      })
      .catch(() => toast.error("Erreur lors de la suppression"));
  };

  if (isLoading || loading) return <div>Chargement...</div>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <section className="user-table-section">
      <ToastContainer transition={Bounce} />
      <h2>Liste des bornes</h2>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Nom de la station</th>
              <th>Adresse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayed.map((t) => (
              <TerminalInfo
                key={t.id}
                nom_station={t}
                editId={editId}
                setEditId={setEditId}
                nomStationEdit={nomStationEdit}
                setNomStationEdit={setNomStationEdit}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>
        {displayed.length < terminals.length && (
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="button"
              className="load-more-button"
              onClick={loadMore}
            >
              Charger plus
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default TerminalList;
