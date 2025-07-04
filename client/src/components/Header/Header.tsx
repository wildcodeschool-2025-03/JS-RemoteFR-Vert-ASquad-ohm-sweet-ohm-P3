import { NavLink } from "react-router";

import "./Header.css";
import header from "../../assets/images/header.png";

function Header() {
  return (
    <header className="header">
      <div className="header-title">
        <div className="header-text">
          <h1>
            Trouvez une borne <br /> avec GEOCODE !
          </h1>
          <h2>Recharger partout !</h2>
        </div>
        <NavLink to="/login">
          <button type="button" className="header-btn1">
            S'inscrire/Connexion
          </button>
        </NavLink>
      </div>

      <img className="header-img" src={header} alt="header" />

      <button type="button" className="header-btn2">
        S'inscrire/Connexion
      </button>
    </header>
  );
}

export default Header;
