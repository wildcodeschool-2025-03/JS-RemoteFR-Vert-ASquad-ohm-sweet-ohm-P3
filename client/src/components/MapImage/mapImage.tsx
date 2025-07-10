import { NavLink } from "react-router-dom";
import "./mapImage.css";

function MapImage() {
  return (
    <>
      <div className="image_map">
        <NavLink to="/maps" className="map_button">
          Voir la carte
        </NavLink>
      </div>
    </>
  );
}

export default MapImage;
