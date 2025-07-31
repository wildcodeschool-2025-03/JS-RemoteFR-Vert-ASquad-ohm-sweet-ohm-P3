import "../Contact/Form.css";
import { useState } from "react";
import type { FormEvent } from "react";

function ContactForm() {
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

      const response = await fetch(`${API_URL}/api/contactForm`, {
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
      <div className="contact-page-container">
        <h1 className="h1contact">Contactez-nous</h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-box">
            <div className="form-group">
              <label htmlFor="objet">Objet :</label>
              <input
                id="objet"
                type="text"
                name="objet"
                value={objet}
                onChange={(e) => {
                  setObjet(e.target.value);
                }}
              />
              {errors.objet && <p className="error">{errors.objet}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email :</label>
              <input
                id="email"
                type="email"
                autoComplete="on"
                name="email"
                value={email}
                onChange={(e) => setMail(e.target.value)}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="nom">Nom :</label>
              <input
                id="nom"
                type="text"
                autoComplete="on"
                name="nom"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
              />
              {errors.nom && <p className="error">{errors.nom}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="prenom">Prénom:</label>
              <input
                id="prenom"
                type="text"
                autoComplete="on"
                name="prenom"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
              />
              {errors.prenom && <p className="error">{errors.prenom}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="message">Votre message:</label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message && <p className="error">{errors.message}</p>}
            </div>
            <button type="submit" className="submit-btn">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ContactForm;
