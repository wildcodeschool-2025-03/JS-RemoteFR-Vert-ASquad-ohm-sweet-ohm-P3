import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./CarList.css";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  profile_pic: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  birthdate: string;
  role_id: number;
}

function CarList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [brands, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/brands/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        credentials: "include",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
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
      <h2>Liste des voitures</h2>
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Type de prise</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((u) => (
              <tr key={u.id}>
                <td>{user.car_brand}</td>
                <td>{user.car_template}</td>
                <td>{user.car_socket}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default CarList;
