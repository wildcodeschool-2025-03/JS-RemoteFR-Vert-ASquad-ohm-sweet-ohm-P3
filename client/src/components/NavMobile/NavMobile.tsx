import "./NavMobile.css";
import { NavLink } from "react-router-dom";
import caddie from "../../assets/images/icone-caddie.png";
import carte from "../../assets/images/icone-carte.png";
import home from "../../assets/images/icone-home.png";
import profil from "../../assets/images/icone-profile.png";

function NavMobile() {
  return (
    <nav className="navmobile">
      <ul>
        <li>
          <NavLink to="/profil">
            <img className="nav-icone" src={profil} alt="icone de profil" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/maps">
            <img className="nav-icone" src={carte} alt="icone de carte" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/">
            <img className="nav-icone" src={home} alt="icone de home" />
          </NavLink>
        </li>
        <li>
          <NavLink to="/bookings">
            <img className="nav-icone" src={caddie} alt="icone de caddie" />
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default NavMobile;
