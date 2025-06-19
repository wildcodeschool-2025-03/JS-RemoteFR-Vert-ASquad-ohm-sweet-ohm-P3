import "./NavBar.css";
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
        <li>PROFIL</li>
        <li>RESERVATION</li>
      </ul>
    </nav>
  );
}

export default NavBar;
