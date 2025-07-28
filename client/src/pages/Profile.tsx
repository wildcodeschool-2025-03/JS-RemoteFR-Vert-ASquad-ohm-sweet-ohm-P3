import axios from "axios";
import { useEffect, useState } from "react";
import avatar from "../assets/images/avatar.jpg";
import voiture from "../assets/images/voiture.jpg";
import "./Profile.css";

type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  car_brand: string;
  car_template: string;
  car_socket: string;
  birthdate: string;
};

type Brand = {
  id: number;
  name: string;
};

type Models = {
  id: number;
  name: string;
  brand_id: number;
};

function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Models[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [carBrand, setCarBrand] = useState("");
  const [carTemplate, setCarTemplate] = useState("");
  const [carSocket, setCarSocket] = useState("");

  const [firstnameError, setFirstnameError] = useState("");
  const [lastnameError, setLastnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [birthdateError, setBirthdateError] = useState("");

  useEffect(() => {
    axios
      // On envoie une requête GET à notre serveur pour récupérer les infos de l’utilisateur avec l’ID 1
      .get(`${import.meta.env.VITE_API_URL}/api/users/1`)
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
        setCarBrand(data.car_brand);
        setCarTemplate(data.car_template);
        setCarSocket(data.car_socket);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Charger toutes les marques
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/brands`)
      .then((res) => setBrands(res.data))
      .catch((err) =>
        console.error("Erreur lors du chargement des marques :", err),
      );
  }, []);

  useEffect(() => {
    if (carBrand && brands.length > 0) {
      const brand = brands.find((b) => b.name === carBrand);
      if (brand) setSelectedBrand(brand.id);
    }
  }, [carBrand, brands]);

  // Charger les modèles de la marque sélectionnée
  useEffect(() => {
    if (selectedBrand) {
      axios
        .get(
          `${import.meta.env.VITE_API_URL}/api/brands/${selectedBrand}/templates`,
        )
        .then((res) => setModels(res.data))
        .catch((err) => {
          console.error("Erreur lors du chargement des modèles :", err);
          setModels([]);
        });
    }
  }, [selectedBrand]);

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
        car_brand: carBrand,
        car_template: carTemplate,
        car_socket: carSocket,
        withCredentials: true,
      });

      // On met aussi à jour l’état local user avec les nouvelles infos
      setUser({
        ...user,
        firstname,
        lastname,
        email,
        birthdate,
        car_brand: carBrand,
        car_template: carTemplate,
        car_socket: carSocket,
      });

      // On affiche un message pour confirmer que tout s’est bien passé
      alert("Profil mis à jour avec succès ! ✅");
    } catch (err) {
      // Si erreur (ex: problème serveur), on affiche un message
      alert("Erreur lors de la mise à jour.");
    }
  };

  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/users/1`, {
        firstname,
        lastname,
        email,
        birthdate,
        car_brand: carBrand,
        car_template: carTemplate,
        car_socket: carSocket,
      });

      setUser((prev) =>
        prev
          ? {
              ...prev,
              car_brand: carBrand,
              car_template: carTemplate,
              car_socket: carSocket,
            }
          : null,
      );

      alert("Véhicule mis à jour avec succès !");
    } catch (err) {
      alert("Erreur lors de la mise à jour du véhicule.");
    }
  };

  const handleFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 35) {
      setFirstnameError("Le prénom ne doit pas dépasser 35 caractères.");
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
    if (new Date(value) >= new Date("2025-01-01")) {
      setBirthdateError("La date de naissance doit être avant 2025.");
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
            Sauvegarder
          </button>
        </form>
      </div>

      <div className="section2">
        <div className="profil2">
          <div className="img-profil2">
            <img src={voiture} alt="Voiture" />
          </div>
        </div>

        <form className="form" onSubmit={handleUpdateVehicle}>
          <div className="form-car">
            <p>Marque</p>
            <select
              value={carBrand}
              onChange={(e) => {
                const brandName = e.target.value;
                setCarBrand(brandName);
                const brand = brands.find((b) => b.name === brandName);
                setSelectedBrand(brand?.id ?? null);
              }}
            >
              <option value="">--Sélectionnez une marque--</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.name}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-car">
            <p>Model</p>
            <select
              value={carTemplate}
              onChange={(e) => setCarTemplate(e.target.value)}
            >
              <option value="">--Sélectionnez un modèle--</option>
              {models.map((model) => (
                <option key={model.id} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-car">
            <p>Type de prise</p>
            <select
              value={carSocket}
              onChange={(e) => setCarSocket(e.target.value)}
            >
              <option value="">--Sélectionnez un type de prise--</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="CCS">CCS</option>
              <option value="CHAdeMO">CHAdeMO</option>
            </select>
          </div>

          <button className="btn-entrer" type="submit">
            Sauvegarder
          </button>
        </form>
      </div>
    </main>
  );
}

export default Profile;
