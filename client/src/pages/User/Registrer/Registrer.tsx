import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "./register.css";
import user from "../../../assets/images/avatar.jpg";
import vehicle from "../../../assets/images/voiture.jpg";

type FormData = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirm_password?: string;
  vehicle: string;
  vehicle_user: string;
  vehicle_socket: string;
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

function Register() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Models[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/brands`,
        );
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error("Erreur lors du chargement des marques:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    const modelsByBrand = async () => {
      if (selectedBrand) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/api/brands/${selectedBrand}/templates`,
          );
          const data: Models[] = await response.json();
          setModels(data);
          setValue("vehicle_user", "");
        } catch (err) {
          err;
          setModels([]);
          setValue("vehicle_user", "");
        }
      }
    };
    modelsByBrand();
  }, [selectedBrand, setValue]);

  const handleForm = async (data: FormData) => {
    try {
      const userData = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
        car_brand: data.vehicle,
        car_template: data.vehicle_user,
        car_socket: data.vehicle_socket,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        },
      );

      if (response.ok) {
        toast.success("Votre compte a bien été créé !");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
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
            <div className="form-columns">
              <div className="form-column">
                <img
                  src={user}
                  alt="Icône utilisateur"
                  className="column-image"
                />{" "}
                <h2 className="userRegister">Informations utilisateur</h2>
                <div className="form-group">
                  <label htmlFor="firstname">Prénom</label>
                  <input
                    {...register("firstname", {
                      required: "Merci de remplir ce champ",
                      minLength: {
                        value: 4,
                        message:
                          "Le champ doit contenir au minimum 4 caractères",
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
                        message:
                          "Le champ doit contenir au minimum 4 caractères",
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
                      pattern: {
                        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                        message:
                          "Le mot de passe doit contenir une majuscule, un chiffre, un caractère spécial et faire au moins 8 caractères",
                      },
                    })}
                    name="password"
                    type="password"
                    placeholder="Mot de passe"
                  />
                  {errors.password && (
                    <span className="error">{errors.password.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label htmlFor="confirm_password">
                    Confirmez le mot de passe
                  </label>
                  <input
                    {...register("confirm_password", {
                      validate: (value) =>
                        value === password ||
                        "Les mots de passe ne correspondent pas",
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
                </div>
              </div>

              <div className="form-column">
                <img
                  src={vehicle}
                  alt="Icône véhicule"
                  className="column-image"
                />
                <h2 className="carRegister">Informations véhicule</h2>
                <div className="form-group">
                  <label htmlFor="vehicle">Marque</label>
                  <select
                    {...register("vehicle", {
                      required: "Sélectionnez une marque",
                    })}
                    onChange={(e) => {
                      const brandName = e.target.value;
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
                  {errors.vehicle && (
                    <span className="error">{errors.vehicle.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="vehicle_user">Modèle</label>
                  <select
                    {...register("vehicle_user", {
                      required: "Sélectionnez un modèle",
                    })}
                  >
                    <option value="">--Sélectionnez un modèle--</option>
                    {models.map((model) => (
                      <option key={model.id} value={model.name}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  {errors.vehicle_user && (
                    <span className="error">{errors.vehicle_user.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="vehicle_socket">Type de prise</label>
                  <select
                    {...register("vehicle_socket", {
                      required: "Sélectionnez un type de prise",
                    })}
                  >
                    <option value="">--Sélectionnez un type de prise</option>
                    <option value="Type 1">Type 1</option>
                    <option value="Type 2">Type 2</option>
                    <option value="CCS">CCS</option>
                    <option value="CHAdeMO">CHAdeMO</option>
                  </select>
                  {errors.vehicle_socket && (
                    <span className="error">
                      {errors.vehicle_socket.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button type="submit" className="submit-btn">
              Créer un compte
            </button>
          </form>
        </div>

        <p className="already-account">
          Vous avez déjà créé un compte ?<br />
          <NavLink to="/login">Identifiez-vous !</NavLink>
        </p>
      </div>
    </>
  );
}

export default Register;
