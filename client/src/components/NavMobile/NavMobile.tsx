import "./NavMobile.css";
import caddie from "../../assets/images/icone-caddie.png";
import carte from "../../assets/images/icone-carte.png";
import home from "../../assets/images/icone-home.png";
import profil from "../../assets/images/icone-profile.png";

function NavMobile() {
  return (
    <nav className="navmobile">
      <ul>
        <li>
          <img className="nav-icone" src={profil} alt="icone de profil" />
        </li>
        <li>
          <img className="nav-icone" src={carte} alt="icone de carte" />
        </li>
        <li>
          <img className="nav-icone" src={home} alt="icone de home" />
        </li>
        <li>
          <img className="nav-icone" src={caddie} alt="icone de caddie" />
        </li>
      </ul>
    </nav>
  );
}

export default NavMobile;
