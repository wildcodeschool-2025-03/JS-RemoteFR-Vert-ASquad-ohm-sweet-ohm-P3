import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "./register.css";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  phone: number;
  password: string;
  confirm_password?: string;
  vehicle: string;
  vehicle_user: number;
  vehicle_socket: number;
};

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");

  const handleForm = async (data: FormData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success("Votre compte a bien été créé !");
      } else {
        toast.error("Erreur lors de la création de votre compte");
      }
    } catch (err) {
      toast.error("Erreur !");
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <div className="register-page">
        <h1 className="titleRegister">Formulaire d'inscription</h1>
        <div className="register-form-container">
          <form onSubmit={handleSubmit(handleForm)}>
            <h2 className="userRegister">Utilisateur</h2>
            <div className="formGroupContainer">
              <div className="form-group">
                <label htmlFor="firstname">Prénom</label>
                <input
                  {...register("firstname", {
                    required: "Merci de remplir ce champ",
                    minLength: {
                      value: 4,
                      message: "Le champ doit contenir au minimum 4 caractères",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "Le champ doit contenir au maximum 50 caractères",
                    },
                  })}
                  name="firstname"
                  type="text"
                  placeholder="John"
                />
                {errors.firstname && (
                  <span className="error">{errors.firstname.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastname">Nom</label>
                <input
                  {...register("lastname", {
                    required: "Merci de remplir ce champ",
                    minLength: {
                      value: 4,
                      message: "Le champ doit contenir au minimum 4 caractères",
                    },
                    maxLength: {
                      value: 50,
                      message:
                        "Le champ doit contenir au maximum 50 caractères",
                    },
                  })}
                  name="lastname"
                  type="text"
                  placeholder="Doe"
                />
                {errors.lastname && (
                  <span className="error">{errors.lastname.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>

                <input
                  {...register("email", {
                    required: "Ce champ est requis",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Le format d'email n'est pas valide",
                    },
                  })}
                  name="email"
                  type="email"
                  placeholder="john@doe.com"
                />
                {errors.email && (
                  <span className="error">{errors.email.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  {...register("password", {
                    required: "Mot de passe requis",
                  })}
                  name="password"
                  type="password"
                  placeholder="Mot de passe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Confirmez le mot de passe</label>
                <input
                  {...register("confirm_password", {
                    validate: (value: string | undefined) => {
                      if (!value) return "Ce champ est requis";
                      return (
                        value === password ||
                        "Les mots de passe ne correspondent pas"
                      );
                    },
                  })}
                  name="confirm_password"
                  type="password"
                  placeholder="Confirmez le mot de passe"
                />
                {errors.confirm_password && (
                  <span className="error">
                    {errors.confirm_password.message}
                  </span>
                )}
                <h2 className="carRegister">Votre véhicule</h2>

                <div className="form-group">
                  <label htmlFor="text">Marque</label>
                  <input
                    {...register("vehicle", {
                      required: "Modèle du véhicule requis",
                    })}
                    name="vehicle"
                    type="text"
                    placeholder="Marque de la voiture"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="text">Modèle</label>
                  <input
                    {...register("vehicle_user", {
                      required: "Modèle du véhicule requis",
                    })}
                    name="vehicle_user"
                    type="text"
                    placeholder="Modèle de la voiture"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="text">Type de prise</label>
                <input
                  {...register("vehicle_socket", {
                    required: "Type de prise requis",
                  })}
                  name="vehicle_socket"
                  type="text"
                  placeholder="Prise de la voiture"
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Create an account
            </button>
          </form>
        </div>

        <div className="already-account">
          Vous avez déjà créé un compte ?
          <NavLink to="/login"> Identifiez-vous !</NavLink>
        </div>
      </div>
    </>
  );
}

export default Register;
