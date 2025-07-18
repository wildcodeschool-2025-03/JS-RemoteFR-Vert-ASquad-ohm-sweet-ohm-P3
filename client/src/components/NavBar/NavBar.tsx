import { NavLink } from "react-router";
import { useAuth } from "../../context/AuthContext";

import "./NavBar.css";
import logo from "../../assets/images/Logo-principal.png";

function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/">
          <img className="logo" src={logo} alt="logo de geocode" />
        </NavLink>
      </div>

      <ul className="navbar-center">
        <li>
          <NavLink to="/">ACCUEIL</NavLink>
        </li>
        <li>
          <NavLink to="/maps">CARTE</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">RESERVATION</NavLink>
        </li>
      </ul>

      <div className="navbar-right">
        {user && (
          <div className="user-info">
            <img
              src={
                user.profile_pic ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="avatar"
              className="user-avatar-navBar"
            />
            <span className="user-name-navBar">
              {user.firstname} {user.lastname}
              <br />
              <button type="button" className="logout-button" onClick={logout}>
                <NavLink to="/" className="logout-link">
                  Déconnexion
                </NavLink>
              </button>
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
