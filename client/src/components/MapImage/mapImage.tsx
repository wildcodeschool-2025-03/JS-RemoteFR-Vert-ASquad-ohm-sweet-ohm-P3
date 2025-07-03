import { NavLink } from "react-router-dom";
import "./mapImage.css";

function MapImage() {
  return (
    <>
      <div className="image_map">
        <NavLink to="/maps">
          <button className="map_button" type="button">
            Voir la carte
          </button>
        </NavLink>
      </div>
    </>
  );
}

export default MapImage;
