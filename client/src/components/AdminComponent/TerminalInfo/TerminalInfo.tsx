import type React from "react";

import "./TerminalInfo.css";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
};

type NomStation = Terminal;

interface Props {
  nom_station: NomStation;
  editId: number | null;
  setEditId: (id: number | null) => void;
  nomStationEdit: Partial<NomStation> | null;
  setNomStationEdit: (nom_station: Partial<NomStation> | null) => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
}

const TerminalInfo: React.FC<Props> = ({
  nom_station,
  editId,
  setEditId,
  nomStationEdit,
  setNomStationEdit,
  onEdit,
  onDelete,
}) => {
  const isEditing = editId === nom_station.id;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (!nomStationEdit) return;

    setNomStationEdit({
      ...nomStationEdit,
      [name]: value,
    });
  };

  const startEdit = () => {
    setEditId(nom_station.id);
    setNomStationEdit({ ...nom_station });
  };

  const cancelEdit = () => {
    setEditId(null);
    setNomStationEdit(null);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            name="nom_station"
            value={nomStationEdit?.nom_station || ""}
            onChange={handleChange}
          />
        ) : (
          nom_station.nom_station
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            name="adresse_station"
            value={nomStationEdit?.adresse_station || ""}
            onChange={handleChange}
          />
        ) : (
          nom_station.adresse_station
        )}
      </td>

      <td>
        {isEditing ? (
          <>
            <button type="button" onClick={onEdit}>
              💾
            </button>
            <button type="button" onClick={cancelEdit}>
              ❌
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={startEdit}>
              ✏️
            </button>
            <button type="button" onClick={() => onDelete(nom_station.id)}>
              🗑️
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default TerminalInfo;
