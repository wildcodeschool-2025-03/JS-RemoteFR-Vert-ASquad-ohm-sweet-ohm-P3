import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import "./UserList.css";
import UsersInfo from "../UsersInfo/UsersInfo";

export interface User {
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

export type Brand = {
  id: number;
  name: string;
};

function UserList() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [userEdit, setUserEdit] = useState<Partial<User> | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/brands`,
      );
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      console.error("Erreur lors du chargement des marques:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      fetch(`${import.meta.env.VITE_API_URL}/api/users/`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((error) => console.error("Erreur dans fetch:", error));
    } catch (error) {
      console.error("Erreur lors du chargement des marques:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    fetchBrands();
  }, [fetchBrands, fetchUsers]);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  const handleEdit = async () => {
    if (!userEdit || !userEdit.id) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/${userEdit.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userEdit),
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la modification");
      }

      const text = await response.text();

      if (!text) {
        toast.success("Utilisateur modifié !");
        setEditId(null);
        setUserEdit(null);
        return;
      }

      const updatedUser = JSON.parse(text);

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u)),
      );

      setEditId(null);
      setUserEdit(null);
      toast.success("Utilisateur modifié !");
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la modification");
    }
  };

  const handleDelete = (id: number) => {
    fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setUsers((prev) => prev.filter((u) => u.id !== id));
        toast.success("Utilisateur supprimé !");
      })
      .catch(() => toast.error("Erreur lors de la suppression"));
  };

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <section className="user-table-section">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Bounce}
      />
      <h2>Liste des utilisateurs</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>Avatar</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Prise</th>
              <th>Naissance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <UsersInfo
                key={u.id}
                user={u}
                editId={editId}
                setEditId={setEditId}
                userEdit={userEdit}
                setUserEdit={setUserEdit}
                onEdit={handleEdit}
                onDelete={handleDelete}
                brands={brands}
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default UserList;
