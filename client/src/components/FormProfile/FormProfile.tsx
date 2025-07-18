type FormProfilProps = {
  name: string;
  lastname: string;
  mail: string;
  phone: number;
  address: string;
  password: string;
  isEdit: boolean;
  setName: (val: string) => void;
  setLastname: (val: string) => void;
  setMail: (val: string) => void;
  setPhone: (val: number) => void;
  setAddress: (val: string) => void;
  setPassword: (val: string) => void;
};

function FormProfil({
  name,
  lastname,
  mail,
  phone,
  address,
  password,
  isEdit,
  setName,
  setLastname,
  setMail,
  setPhone,
  setAddress,
  setPassword,
}: FormProfilProps) {
  return (
    <form className="form-profil">
      <label>
        Nom
        <input
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          readOnly={!isEdit}
        />
      </label>

      <label>
        Prénom
        <input
          type="text"
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          readOnly={!isEdit}
        />
      </label>

      <label>
        Adresse mail
        <input
          type="email"
          value={mail}
          onChange={(event) => setMail(event.target.value)}
          readOnly={!isEdit}
        />
      </label>

      <label>
        Téléphone
        <input
          type="tel"
          value={phone}
          onChange={(event) => setPhone(Number(event.target.value))}
          readOnly={!isEdit}
        />
      </label>

      <label>
        Adresse
        <input
          type="text"
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          readOnly={!isEdit}
        />
      </label>

      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          readOnly={!isEdit}
        />
      </label>
    </form>
  );
}

export default FormProfil;
