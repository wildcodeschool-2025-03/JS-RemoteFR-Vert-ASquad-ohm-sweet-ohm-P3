import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

import { toast } from "react-toastify";
import TerminalList from "../../components/AdminComponent/TerminalList/TerminalList";
import UserList from "../../components/AdminComponent/UserList/UserList";

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  fetch(`${import.meta.env.VITE_API_URL}/api/your-endpoint`, {
    method: "POST",
    headers: {
      credentials: "include",
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      return res.json();
    })
    .then(() => toast("Fichier envoyé avec succès !"))
    .catch((error) => {
      console.error("Erreur:", error);
    });

  return (
    <div className="adminInfo">
      <h1>Bienvenue sur la page d'administration !</h1>
      <UserList />
      <TerminalList />
    </div>
  );
}

export default AdminPage;
