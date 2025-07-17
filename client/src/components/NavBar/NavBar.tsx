import { NavLink } from "react-router";

import "./NavBar.css";
import { Link } from "react-router";
import logo from "../../assets/images/Logo-principal.png";

function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <NavLink to="/">ACCUEIL</NavLink>
        </li>
        <li>
          <NavLink to="/maps">CARTE</NavLink>
        </li>
      </ul>
      <NavLink to="/">
        <img className="logo" src={logo} alt="logo de geocode" />
      </NavLink>
      <ul>
        <Link to="profil">
          <li>PROFIL</li>
        </Link>
        <li>
          <NavLink to="/bookings">RESERVATION</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavBar;
