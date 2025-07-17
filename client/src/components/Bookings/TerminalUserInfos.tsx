import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import MapSingleTerminal from "../Map/MapSingleTerminal";
import "./TerminalUserInfos.css";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
  consolidated_latitude: number;
  consolidated_longitude: number;
};

function TerminalUserInfos() {
  const { id } = useParams();
  const [terminal, setTerminal] = useState<Terminal | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTerminal = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/terminals/${id}`,
      );
      if (res.ok) {
        const data = await res.json();
        setTerminal(data);
      }
    };

    if (id) fetchTerminal();
  }, [id]);

  if (!terminal || !user) return <div>Chargement des données...</div>;

  const fullName = `${user.firstname} ${user.lastname}`;
  const avatar = user.profile_pic
    ? `${user.profile_pic}`
    : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  return (
    <div className="terminal-container">
      <h1 className="page-title">Réservation</h1>

      <div className="terminal-content">
        <div className="user-infos">
          <img src={avatar} alt={fullName} className="user-avatar" />
          <h2 className="user-name">{fullName}</h2>
          <p className="user-car">
            {user.car_brand} {user.car_template}
          </p>
        </div>

        <div className="terminal-details">
          <div className="terminal-map">
            <MapSingleTerminal
              lat={terminal.consolidated_latitude}
              lng={terminal.consolidated_longitude}
            />
          </div>
          <div className="terminal-address">
            <p>📍 {terminal.adresse_station}</p>
            <NavLink to="/maps" className="change-terminal">
              Changer de borne
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerminalUserInfos;
