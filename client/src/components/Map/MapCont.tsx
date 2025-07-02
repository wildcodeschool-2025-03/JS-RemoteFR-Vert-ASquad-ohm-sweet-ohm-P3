import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapContainer.css";
import L from "leaflet";
import LocationMarker from "./MapGeoloc";
import RoutingMachine from "./RoutingMachine";

function MapContainers() {
  const positionDefault = L.latLng([48.86, 2.33]);

  return (
    <>
      <MapContainer center={positionDefault} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <RoutingMachine />
      </MapContainer>
    </>
  );
}

export default MapContainers;
