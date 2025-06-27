import "./NavBar.css";
import { Link } from "react-router";
import logo from "../../assets/images/Logo-principal.png";

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li>ACCUEIL</li>
        <li>CARTE</li>
      </ul>

      <img className="logo" src={logo} alt="logo de geocode" />

      <ul>
        <Link to="profil">
          <li>PROFIL</li>
        </Link>
        <li>RESERVATION</li>
      </ul>
    </nav>
  );
}

export default NavBar;
