import { NavLink } from "react-router";

import "./Header.css";
import header from "../../assets/images/header.png";
import header2 from "../../assets/images/image_header1.png";

function Header() {
  return (
    <header className="header">
      <div className="header-content-wrapper">
        <img className="header-img header-img-left" src={header2} alt="borne" />

        <div className="header-title">
          <div className="header-text">
            <h1>
              Trouvez une borne <br /> avec <br /> GEOCODE !{" "}
            </h1>
            <h2>Recharger partout !</h2>
          </div>
          <NavLink to="/login" className="header-btn1">
            S'inscrire/Connexion
          </NavLink>
        </div>

        <img
          className="header-img header-img-right"
          src={header}
          alt="header"
        />
      </div>

      <button type="button" className="header-btn2">
        S'inscrire/Connexion
      </button>
    </header>
  );
}

export default Header;
