import "./login.css";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";

type User = {
  id: number;
  email: string;
};

type Auth = {
  user: User;
  token: string;
};

type FormData = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const { setAuth } = useOutletContext() as {
    setAuth: (auth: Auth | null) => void;
  };

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) throw new Error("Identifiants incorrects");

      const result = await response.json();

      toast.success("Connexion réussie !");
      setAuth(result);

      setTimeout(() => {
        navigate("/maps");
      }, 2000);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Erreur serveur");
    }
  };

  return (
    <div className="login-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        transition={Bounce}
      />
      <div className="login-box">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
            <input
              {...register("email", {
                required: "Email requis",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                },
              })}
              type="email"
              placeholder="john@doe.com"
              className="form-input"
            />
            {errors.email && (
              <span className="error-message">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Mot de passe
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
                  message:
                    "Le mot de passe doit contenir une majuscule, un chiffre, un caractère spécial et faire au moins 8 caractères",
                },
              })}
              name="password"
              type="password"
              className="form-input"
              placeholder="Enter password"
            />
            {errors?.password && (
              <span className="error-message">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" className="submit-btn">
            Se connecter
          </button>
        </form>
      </div>
      <p className="inscription">
        Vous n'avez pas encore de compte ?{" "}
        <NavLink to="/inscription">Inscrivez-vous !</NavLink>
      </p>
    </div>
  );
}

export default Login;
