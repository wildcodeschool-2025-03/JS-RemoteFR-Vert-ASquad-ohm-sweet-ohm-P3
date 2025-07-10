import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapContainer.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Cluster from "./MapCluster";
import LocationMarker from "./MapGeoloc";

function MapContainers() {
  const positionDefault = L.latLng([48.86, 2.33]);

  const [terminals, setTerminals] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/terminals`)
      .then((res) => res.json())
      .then((data) => {
        setTerminals(data.slice(0, 10000));
      })
      .catch((err) => {
        console.error("Erreur en récupérant les terminals :", err);
      });
  }, []);

  return (
    <>
      <MapContainer center={positionDefault} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <Cluster terminals={terminals} />
      </MapContainer>
    </>
  );
}

export default MapContainers;
