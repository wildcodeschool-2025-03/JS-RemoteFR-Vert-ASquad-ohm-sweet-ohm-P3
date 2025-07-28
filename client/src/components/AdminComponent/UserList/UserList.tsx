import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./UserList.css";

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

function UserList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/users/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
      <h2>Liste des utilisateurs</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Voiture</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <img src={u.profile_pic} alt="Avatar" className="avatar" />
                </td>
                <td>{u.firstname}</td>
                <td>{u.lastname}</td>
                <td>{u.email}</td>
                <td>{u.car_brand}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserList;
