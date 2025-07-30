import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";
import { useForm } from "react-hook-form";

import { toast } from "react-toastify";
import UserList from "../../components/AdminComponent/UserList/UserList";
import Dropcsv from "../../components/Drop/Dropcsv";
import TerminalList from "../../components/TerminalList/TerminalList";

type ClassFormFields = {
  csv: string;
  user_id: number;
};

function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  if (isLoading) return <div>Chargement...</div>;
  if (!isAuthenticated || user?.role_id !== 1) return null;

  return (
    <div className="adminInfo">
      <h1>Bienvenue sur la page d'administration !</h1>
      <UserList />
      <TerminalList />
      <input type="hidden" {...register("user_id")} value={user?.id || 0} />

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <Dropcsv onFileSelect={setSelectedFile} />
        {!selectedFile && <p className="error">Le fichier est requis</p>}

        <input className="submitBtnClass" type="submit" value="Envoyer" />
      </form>
    </div>
  );
}

export default AdminPage;
