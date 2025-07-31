import type React from "react";
import "./TerminalInfo.css";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
};

interface Props {
  nom_station: Terminal;
  onDelete: (id: number) => void;
}

const TerminalInfo: React.FC<Props> = ({ nom_station, onDelete }) => {
  return (
    <tr>
      <td>{nom_station.nom_station}</td>
      <td>{nom_station.adresse_station}</td>
      <td>
        <button
          type="button"
          onClick={() => onDelete(nom_station.id)}
          className="delete-button"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
};

export default TerminalInfo;
