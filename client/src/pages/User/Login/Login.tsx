import "./login.css";
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

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

  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (data: FormData) => {
    try {
      const success = await login(data.email, data.password);

      if (success) {
        toast.success("Connexion réussie !");
        setTimeout(() => {
          navigate("/maps");
        }, 2000);
      } else {
        toast.error("Identifiaants incorrects");
      }
    } catch (err) {
      const error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <section className="login-container">
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
        Vous n'avez pas encore de compte ?<br />
        <NavLink to="/inscription">Inscrivez-vous !</NavLink>
      </p>
    </section>
  );
}

export default Login;
