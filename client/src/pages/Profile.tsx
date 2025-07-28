import axios from "axios";
import { useEffect, useState } from "react";
import avatar from "../assets/images/avatar.png";
import voiture from "../assets/images/voiture.png";
import "./Profile.css";

interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  birthdate: string;
}

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${import.meta.env.VITE_API_URL}/api/users/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erreur lors de la récupération de l'utilisateur");
        }
        return res.json();
      })
      .then((data) => {
        const birthdate = data.birthdate
          ? new Date(data.birthdate).toISOString().split("T")[0]
          : "";

        setUser(data);
        setFirstname(data.firstname);
        setLastname(data.lastname);
        setEmail(data.email);
        setBirthdate(birthdate);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur dans fetch:", error);
        setLoading(false);
      });
  }, []);

  // Cette fonction est déclenchée quand on valide le formulaire en appuyant sur entrer
  const handleUpdate = async (e: React.FormEvent) => {
    // On empêche le rechargement de la page par défaut
    e.preventDefault();

    if (firstnameError || lastnameError || emailError || birthdateError) {
      alert("Veuillez corriger les erreurs avant de soumettre.");
      return;
    }

    if (!user) return;

    try {
      // On envoie une requête PUT au backend pour modifier les infos utilisateur
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/1`, {
        firstname,
        lastname,
        email,
        birthdate,
        withCredentials: true,
      });

      // On met aussi à jour l’état local user avec les nouvelles infos
      setUser({
        ...user,
        firstname,
        lastname,
        email,
        birthdate,
      });

      // On affiche un message pour confirmer que tout s’est bien passé
      alert("Profil mis à jour avec succès ! ✅");
    } catch (err) {
      // Si erreur (ex: problème serveur), on affiche un message
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 15) {
      setFirstnameError("Le prénom ne doit pas dépasser 15 caractères.");
    } else {
      setFirstnameError("");
    }
    setFirstname(value);
  };

  const handleLastnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 15) {
      setLastnameError("Le nom ne doit pas dépasser 15 caractères.");
    } else {
      setLastnameError("");
    }
    setLastname(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Exemple simple, tu peux ajouter regex email si tu veux
    if (value.length > 50) {
      setEmailError("L'email ne doit pas dépasser 50 caractères.");
    } else {
      setEmailError("");
    }
    setEmail(value);
  };

  const handleBirthdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (new Date(value) >= new Date("2005-01-01")) {
      setBirthdateError("La date de naissance doit être avant 2005.");
    } else {
      setBirthdateError("");
    }
    setBirthdate(value);
  };

  // Si les données sont encore en train de se charger, on affiche un message temporaire
  if (loading) {
    return <p>Chargement...</p>;
  }

  // Si on n’a pas réussi à récupérer l'utilisateur, on affiche un message d’erreur
  if (!user) {
    return <p>Utilisateur introuvable.</p>;
  }

  return (
    <main>
      <div className="header1" />

      <div className="section1">
        <div className="profil">
          <h1>Profil</h1>
          <div className="img-profil">
            <img src={avatar} alt="Avatar" />
          </div>
        </div>

        <form className="form" onSubmit={handleUpdate}>
          <label className="label-profil">
            <p>Prenom</p>
            <input
              type="text"
              value={firstname}
              onChange={handleFirstnameChange}
            />
            {firstnameError && <p className="error">{firstnameError}</p>}
          </label>

          <label className="label-profil">
            <p>Nom</p>
            <input
              type="text"
              value={lastname}
              onChange={handleLastnameChange}
            />
            {lastnameError && <p className="error">{lastnameError}</p>}
          </label>

          <label className="label-profil">
            <p>Email</p>
            <input type="email" value={email} onChange={handleEmailChange} />
            {emailError && <p className="error">{emailError}</p>}
          </label>

          <label className="label-profil">
            <p>Date de naissance</p>
            <input
              type="date"
              value={birthdate}
              onChange={handleBirthdateChange}
            />
            {birthdateError && <p className="error">{birthdateError}</p>}
          </label>

          <button className="btn-entrer" type="submit">
            Envoyer
          </button>
        </form>
      </div>

      <div className="section2">
        <div className="profil2">
          <div className="img-profil2">
            <img src={voiture} alt="Voiture" />
          </div>
        </div>

        <div className="form">
          <label className="label-profil">
            <p>Marque</p>
            <input type="text" value={user.car_brand} readOnly />
          </label>

          <label className="label-profil">
            <p>Modele</p>
            <input type="text" value={user.car_template} readOnly />
          </label>

          <label className="label-profil">
            <p>Type de prise</p>
            <input type="text" value={user.car_socket} readOnly />
          </label>
        </div>
      </div>

      <div className="historique">
        <h2>Historique de réservation</h2>
        <ul className="historique-list">
          <li>📅 26 juin 2025 📍 67000 Strasbourg ⏱️ 45 min</li>
        </ul>
      </div>
    </main>
  );
}

export default Profile;
