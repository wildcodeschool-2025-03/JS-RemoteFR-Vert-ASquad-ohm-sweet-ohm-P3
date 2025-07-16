import "../Contact/Form.css";
import { useState } from "react";
import type { FormEvent } from "react";

function Form() {
  const [objet, setObjet] = useState("");
  const [email, setMail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  interface FormErrors {
    objet?: string;
    email?: string;
    nom?: string;
    prenom?: string;
    message?: string;
  }

  const validate = () => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!objet) {
      tempErrors.objet = "L'objet est requis.";
      isValid = false;
    }
    if (!email) {
      tempErrors.email = "L'e-mail est requis.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Le format de l'e-mail n'est pas valide.";
      isValid = false;
    }
    if (!nom) {
      tempErrors.nom = "Le nom est requis.";
      isValid = false;
    }

    if (!prenom) {
      tempErrors.prenom = "Le prénom est requis.";
      isValid = false;
    }

    if (!message) {
      tempErrors.message = "Le message est requis.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_URL}/api/form`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objet, email, nom, prenom, message }),
      });

      if (response.ok) {
        alert("E-mail envoyé avec succès !");
        setObjet("");
        setMail("");
        setNom("");
        setPrenom("");
        setMessage("");
      } else {
        const errorData = await response.json();
        alert(errorData);
      }
    } catch (error) {
      console.error(error);
      alert("Une erreur de connexion est survenue.");
    }
  };
  return (
    <>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-box">
          <label className="form-group">
            Objet :
            <input
              type="text"
              name="objet"
              value={objet}
              onChange={(e) => {
                setObjet(e.target.value);
              }}
            />
            {errors.objet && <p className="errorform">{errors.objet}</p>}
          </label>
          <label className="form-group">
            Email :
            <input
              type="email"
              autoComplete="on"
              name="email"
              value={email}
              onChange={(e) => setMail(e.target.value)}
            />
            {errors.email && <p className="errorform">{errors.email}</p>}
          </label>
          <label className="form-group">
            Nom :
            <input
              type="text"
              autoComplete="on"
              name="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            {errors.nom && <p className="errorform">{errors.nom}</p>}
          </label>
          <label className="form-group">
            Prénom:
            <input
              type="text"
              autoComplete="on"
              name="prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            {errors.prenom && <p className="errorform">{errors.prenom}</p>}
          </label>
          <label className="form-group">
            Votre message:
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <p className="errorform">{errors.message}</p>}
          </label>
          <button type="submit" className="submit-btn">
            Envoyer
          </button>
        </div>
      </form>
    </>
  );
}

export default Form;
