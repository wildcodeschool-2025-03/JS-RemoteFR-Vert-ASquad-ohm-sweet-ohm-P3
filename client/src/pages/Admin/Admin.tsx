import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import UserList from "../../components/AdminComponent/UserList/UserList";
import Dropcsv from "../../components/Drop/Dropcsv";
import TerminalList from "../../components/TerminalList/TerminalList";

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
}

type ClassFormFields = {
  csv: string;
  user_id: number;
};

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit } = useForm<ClassFormFields>({
    defaultValues: {
      csv: "",
      user_id: 0,
    },
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role_id !== 1)) {
      navigate("/");
    }
  }, [isLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/users/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedUser(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur dans fetch:", error);
        setLoading(false);
      });
  }, []);

  const onSubmitForm = (data: ClassFormFields) => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("csv", data.csv);
    formData.append("user_id", String(data.user_id));

    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/your-endpoint`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur lors de l'envoi");
        return res.json();
      })
      .then(() => toast("Fichier envoyé avec succès !"))
      .catch((error) => {
        console.error("Erreur:", error);
        toast.error("Erreur lors de l'envoi");
      });
  };

  if (isLoading || loading) return <div>Chargement...</div>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <h1>Bienvenue sur la page d'administration !</h1>
        <UserList />
        <TerminalList />
        <input
          type="hidden"
          {...register("user_id")}
          value={selectedUser?.id || 0}
        />

        <Dropcsv onFileSelect={setSelectedFile} />
        {!selectedFile && <p className="error">Le fichier est requis</p>}

        <input className="submitBtnClass" type="submit" value="Envoyer" />
      </form>
    </div>
  );
}

export default AdminPage;
