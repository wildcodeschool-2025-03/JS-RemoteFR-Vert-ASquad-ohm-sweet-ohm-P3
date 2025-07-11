import "../Contact/Form.css";
import { useState } from "react";

function Form() {
  const [objet, setObjet] = useState("");
  const [email, setMail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    alert("Message envoyé");
    e.preventDefault();
  }

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
          </label>
          <label className="form-group">
            Votre message:
            <textarea
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
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
