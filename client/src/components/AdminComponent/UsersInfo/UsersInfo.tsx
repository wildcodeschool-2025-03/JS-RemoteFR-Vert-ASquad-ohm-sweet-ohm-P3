import type React from "react";
import { useEffect, useState } from "react";
import "./UserInfo.css";
import type { Brand, User } from "../UserList/UserList";

interface Props {
  user: User;
  editId: number | null;
  setEditId: (id: number | null) => void;
  userEdit: Partial<User> | null;
  setUserEdit: (user: Partial<User> | null) => void;
  onEdit: () => void;
  onDelete: (id: number) => void;
  brands: Brand[];
}

type Model = {
  id: number;
  name: string;
  brand_id: number;
};

const MODELS_CACHE: { [key: number]: Model[] } = {};
/**
 * MODELS_CACHE = {
 *  1: [{model}, {model}, {model}]
 *  2: ....
 *
 * }
 */

function formatDate(dateString: string) {
  if (!dateString) return "";
  const parts = dateString.slice(0, 10).split("-");
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
}

const carSockets = ["Type 1", "Type 2", "Combo CCS", "CHAdeMO"];

const UsersInfo: React.FC<Props> = ({
  user,
  editId,
  setEditId,
  userEdit,
  setUserEdit,
  onEdit,
  onDelete,
  brands,
}) => {
  const isEditing = editId === user.id;
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const selectedBrand = brands.find((b) => b.name === userEdit?.car_brand);
    if (selectedBrand) {
      if (MODELS_CACHE[selectedBrand.id]) {
        setModels(MODELS_CACHE[selectedBrand.id]);
      } else {
        const fetchModels = async () => {
          try {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/brands/${
                selectedBrand.id
              }/templates`,
            );
            const data = await response.json();
            MODELS_CACHE[selectedBrand.id] = data;
            setModels(data);
          } catch (error) {
            console.error("Erreur lors du chargement des modèles:", error);
            setModels([]);
          }
        };
        fetchModels();
      }
    } else {
      setModels([]);
    }
  }, [userEdit, brands]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (!userEdit) return;

    setUserEdit({
      ...userEdit,
      [name]: value,
    });
  };

  const startEdit = () => {
    setEditId(user.id);
    setUserEdit({ ...user });
  };

  const cancelEdit = () => {
    setEditId(null);
    setUserEdit(null);
  };

  return (
    <tr>
      <td>
        <img src={user.profile_pic} alt="avatar" width={40} />
      </td>

      <td>
        {isEditing ? (
          <input
            name="firstname"
            value={userEdit?.firstname || ""}
            onChange={handleChange}
          />
        ) : (
          user.firstname
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            name="lastname"
            value={userEdit?.lastname || ""}
            onChange={handleChange}
          />
        ) : (
          user.lastname
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            name="email"
            value={userEdit?.email || ""}
            onChange={handleChange}
          />
        ) : (
          user.email
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            name="car_brand"
            value={userEdit?.car_brand || ""}
            onChange={handleChange}
          >
            <option value="">--Sélectionnez une marque--</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.name}>
                {brand.name}
              </option>
            ))}
          </select>
        ) : (
          user.car_brand
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            name="car_template"
            value={userEdit?.car_template || ""}
            onChange={handleChange}
          >
            <option value="">--Sélectionnez un modèle--</option>
            {models.map((model) => (
              <option key={model.id} value={model.name}>
                {model.name}
              </option>
            ))}
          </select>
        ) : (
          user.car_template
        )}
      </td>

      <td>
        {isEditing ? (
          <select
            name="car_socket"
            value={userEdit?.car_socket || ""}
            onChange={handleChange}
          >
            <option value="">--Sélectionnez un type de prise--</option>
            {carSockets.map((socket) => (
              <option key={socket} value={socket}>
                {socket}
              </option>
            ))}
          </select>
        ) : (
          user.car_socket
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            type="date"
            name="birthdate"
            value={userEdit?.birthdate?.slice(0, 10) || ""}
            onChange={handleChange}
          />
        ) : (
          formatDate(user.birthdate)
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
            <button type="button" onClick={() => onDelete(user.id)}>
              🗑️
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default UsersInfo;
