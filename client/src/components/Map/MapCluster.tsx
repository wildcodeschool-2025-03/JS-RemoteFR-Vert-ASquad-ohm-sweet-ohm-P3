import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Terminal = {
  id: number;
  nom_station: string;
  adresse_station: string;
  consolidated_latitude: number;
  consolidated_longitude: number;
};

function Cluster({ terminals }: { terminals: Terminal[] }) {
  return (
    <MarkerClusterGroup>
      {terminals.map((terminal) => (
        <Marker
          key={terminal.id}
          position={[
            terminal.consolidated_latitude,
            terminal.consolidated_longitude,
          ]}
        >
          <Popup>
            <strong>{terminal.nom_station}</strong>
            <br />
            {terminal.adresse_station}
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

export default Cluster;
