import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import "./NavBar.css";
import logo from "../../assets/images/Logo-principal.png";

function NavBar() {
  const { user, logout } = useAuth();
  const [showUserInfo, setShowUserInfo] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setShowUserInfo(false);
      const timer = setTimeout(() => {
        setShowUserInfo(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <NavLink to="/" className="logo-link">
          <img className="logo" src={logo} alt="logo de geocode" />
        </NavLink>
      </div>

      <div className="navbar-links-split">
        <ul className="navbar-center">
          <li>
            <NavLink to="/">ACCUEIL</NavLink>
          </li>
          <li>
            <NavLink to="/maps">CARTE</NavLink>
          </li>
        </ul>

        <ul className="navbar-profil">
          <li>
            <NavLink to="/profil">PROFIL</NavLink>
          </li>
          <li>
            <NavLink to="/bookings">RESERVATION</NavLink>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <div
          className="user-info"
          style={{ visibility: user && showUserInfo ? "visible" : "hidden" }}
        >
          <img
            src={
              user?.profile_pic ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="avatar"
            className="user-avatar-navBar"
          />
          <span className="user-name-navBar">
            {user?.firstname} {user?.lastname}
            <br />
            <button
              type="button"
              className="logout-button"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Déconnexion
            </button>
          </span>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
