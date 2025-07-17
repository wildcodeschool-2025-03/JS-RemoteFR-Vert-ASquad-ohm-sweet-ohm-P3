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

  useEffect(() => {
    axios
      // On envoie une requête GET à notre serveur pour récupérer les infos de l’utilisateur avec l’ID 1
      .get("http://localhost:3310/api/users/1")
      .then((res) => {
        const data = res.data;

        // On formate le birthdate pour qu'il soit compatible abev le input de type "date"
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
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Cette fonction est déclenchée quand on valide le formulaire en appuyant sur entrer
  const handleUpdate = async (e: React.FormEvent) => {
    // On empêche le rechargement de la page par défaut
    e.preventDefault();
    if (!user) return;

    try {
      // On envoie une requête PUT au backend pour modifier les infos utilisateur
      await axios.put(`http://localhost:3310/api/users/${user.id}`, {
        firstname,
        lastname,
        email,
        birthdate,
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
      alert("Profil mis à jour avec succès !");
    } catch (err) {
      // Si erreur (ex: problème serveur), on affiche un message
      alert("Erreur lors de la mise à jour.");
    }
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
              onChange={(e) => setFirstname(e.target.value)}
            />
          </label>

          <label className="label-profil">
            <p>Nom</p>
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </label>

          <label className="label-profil">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="label-profil">
            <p>Date de naissance</p>
            <input
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </label>

          <button className="btn-entrer" type="submit">
            envoyer
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
