import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapContainer.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import Cluster from "./MapCluster";
import LocationMarker from "./MapGeoloc";
import MapLocationLeafletUser from "./MapLocationLeafletUser";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
  consolidated_latitude: number;
  consolidated_longitude: number;
  prise_type_ef: number;
  prise_type_2: number;
  prise_type_combo_ccs: number;
  prise_type_chademo: number;
  prise_type_autre: number;
};

function MapContainers() {
  const positionDefault = L.latLng([48.86, 2.33]);

  const [terminals, setTerminals] = useState<Terminal[]>([]);
  const [mapLimit, setMapLimit] = useState<L.LatLngBounds | null>(null);
  const [mapZoom, setMapZoom] = useState<number>(12);

  useEffect(() => {
    if (!mapLimit) {
      return;
    }
    if (mapZoom < 10) {
      setTerminals([]);
      return;
    }

    const northEastLat = mapLimit.getNorthEast().lat;
    const northEastLng = mapLimit.getNorthEast().lng;
    const southWestLat = mapLimit.getSouthWest().lat;
    const southWestLng = mapLimit.getSouthWest().lng;

    const bbox = `${southWestLng},${southWestLat},${northEastLng},${northEastLat}`;
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/terminals?bbox=${bbox}`;

    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data: Terminal[]) => {
        setTerminals(data);
      })
      .catch(() => {
        setTerminals([]);
      });
  }, [mapLimit, mapZoom]);

  return (
    <>
      <MapContainer center={positionDefault} zoom={12} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
        <Cluster terminals={terminals} />
        <MapLocationLeafletUser
          setMapLimit={setMapLimit}
          setMapZoom={setMapZoom}
        />
      </MapContainer>
    </>
  );
}

export default MapContainers;
