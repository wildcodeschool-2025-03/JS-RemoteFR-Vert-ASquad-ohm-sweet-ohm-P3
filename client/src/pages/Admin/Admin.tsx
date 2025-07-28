import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust the path as needed

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role_id !== 1) {
        navigate("/");
      }
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (!isAuthenticated || user?.role_id !== 1) {
    return null;
  }

  return (
    <div>
      <h1>Bienvenue sur la page d'administration !</h1>
    </div>
  );
}

export default AdminPage;
