import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pagenotfound from "../assets/images/newpage404.png";
import "../pages/NotFoundPage.css";

function NotFoundPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container404">
      <img
        src={pagenotfound}
        alt="Page non trouvée"
        className="background404"
      />
      <div className="text">
        <h1>404 - Page non trouvée</h1>
        <p>Désolé, cette page n'existe pas ou a été déplacée.</p>
        <div className="spinner404" />
      </div>
    </div>
  );
}

export default NotFoundPage;
