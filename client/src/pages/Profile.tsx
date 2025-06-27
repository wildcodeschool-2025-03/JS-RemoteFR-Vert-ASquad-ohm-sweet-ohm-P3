import { useEffect, useRef, useState } from "react";
import avatar from "../assets/images/avatar.png";
import voiture from "../assets/images/voiture.png";
import "./Profile.css";
import FormProfil from "../components/FormProfile/FormProfile";

function Profile() {
  const [isEdit, setIsEdit] = useState(false);
  const [imageProfil, setImageProfil] = useState<string | null>(null);
  const [imageProfil2, setImageProfil2] = useState<string | null>(null);
  const inputFichier = useRef<HTMLInputElement | null>(null);
  const btnFichier = useRef<HTMLInputElement | null>(null);

  const [nom, setNom] = useState("Kaneb");
  const [prenom, setPrenom] = useState("Florentin");
  const [email, setEmail] = useState("flo@gmail.com");
  const [telephone, setTelephone] = useState("07.00.00.00.00");
  const [adresse, setAdresse] = useState("7 rue du boulanger");
  const [motdepasse, setMotdepasse] = useState("mot de passe");
  const [marque, setMarque] = useState("tesla");
  const [modele, setModele] = useState("y");
  const [prise, setPrise] = useState("tesla");

  useEffect(() => {
    const imageSauvegardee = localStorage.getItem("imageProfil");
    if (imageSauvegardee) {
      setImageProfil(imageSauvegardee);
    }
  }, []);

  useEffect(() => {
    const imageSauvegardee = localStorage.getItem("imageProfil2");
    if (imageSauvegardee) {
      setImageProfil2(imageSauvegardee);
    }
  }, []);

  const selectFichier = () => {
    inputFichier.current?.click();
  };

  const selectFichier2 = () => {
    btnFichier.current?.click();
  };

  const profilChanger = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fichiers = event.target.files;
    if (!fichiers || fichiers.length === 0) return;

    const fichier = fichiers[0];

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = reader.result as string;
      setImageProfil(imageBase64);
      localStorage.setItem("imageProfil", reader.result as string);
    };
    reader.readAsDataURL(fichier);
  };

  const profilChanger2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fichiers = event.target.files;
    if (!fichiers || fichiers.length === 0) return;

    const fichier = fichiers[0];

    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = reader.result as string;
      setImageProfil2(imageBase64);
      localStorage.setItem("imageProfil2", reader.result as string);
    };
    reader.readAsDataURL(fichier);
  };

  return (
    <main>
      <div className="header1" />

      <div className="section1">
        <div className="profil">
          <h1>Profile</h1>
          <div className="img-profil">
            <img src={imageProfil || avatar} alt="Mon avatar" />
            <button
              className="edit-profil"
              type="button"
              onClick={selectFichier}
            >
              ✏️
            </button>

            <input
              type="file"
              accept="image/*"
              ref={inputFichier}
              style={{ display: "none" }}
              onChange={profilChanger}
            />
          </div>
        </div>

        <div className="form">
          <FormProfil
            name={nom}
            lastname={prenom}
            mail={email}
            phone={Number(telephone.replace(/\D/g, ""))}
            address={adresse}
            password={motdepasse}
            isEdit={isEdit}
            setName={setNom}
            setLastname={setPrenom}
            setMail={setEmail}
            setPhone={(val) => setTelephone(val.toString())}
            setAddress={setAdresse}
            setPassword={setMotdepasse}
          />
        </div>
        <div className="btn-profil1">
          <button
            type="button"
            className="btn-profil"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "Enregistrer" : "Modifier"}
          </button>
        </div>
      </div>

      <div className="section2">
        <div className="profil2">
          <div className="img-profil2">
            <img src={imageProfil2 || voiture} alt="Mon avatar" />
            <button
              className="edit-profil"
              type="button"
              onClick={selectFichier2}
            >
              ✏️
            </button>
            <input
              type="file"
              accept="image/*"
              ref={btnFichier}
              style={{ display: "none" }}
              onChange={profilChanger2}
            />
          </div>
        </div>

        <div className="form">
          <form className="form-profil">
            <label>
              Marque
              <input
                type="text"
                name="marque"
                value={marque}
                onChange={(event) => setModele(event.target.value)}
                readOnly={!isEdit}
              />
            </label>
            <label>
              Marque
              <input
                type="text"
                name="marque"
                value={modele}
                onChange={(event) => setMarque(event.target.value)}
                readOnly={!isEdit}
              />
            </label>
            <label>
              Marque
              <input
                type="text"
                name="prise"
                value={prise}
                onChange={(event) => setPrise(event.target.value)}
                readOnly={!isEdit}
              />
            </label>
          </form>
        </div>

        <div className="btn-profil2">
          <button
            type="button"
            className="btn-profil"
            onClick={() => setIsEdit(!isEdit)}
          >
            {isEdit ? "Enregistrer" : "Modifier"}
          </button>
        </div>
      </div>
      <div className="historique">
        <h2>Historique de reservation</h2>
        <ul className="historique-list">
          <li>📅 26 juin 2025 📍 67000 Strasbourg ⏱️ 45 min</li>
          <li>📅 20 juin 2025 📍 68000 Mulhous ⏱️ 30 min</li>
          <li>📅 16 juin 2025 📍 75000 Paris ⏱️ 15 min</li>
        </ul>
      </div>
    </main>
  );
}

export default Profile;
