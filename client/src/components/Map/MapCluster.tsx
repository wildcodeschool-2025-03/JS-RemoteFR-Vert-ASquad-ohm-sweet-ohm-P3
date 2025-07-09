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
  prise_type_ef: number;
  prise_type_2: number;
  prise_type_combo_ccs: number;
  prise_type_chademo: number;
  prise_type_autre: number;
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
            <strong>Types de prises disponibles :</strong>
            <ul>
              {terminal.prise_type_ef === 1 && <li>PRISE TYPE E/F</li>}
              {terminal.prise_type_2 === 1 && <li>PRISE TYPE 2</li>}
              {terminal.prise_type_combo_ccs === 1 && <li>PRISE COMBO CCS</li>}
              {terminal.prise_type_chademo === 1 && <li>PRISE CHADEMO</li>}
              {terminal.prise_type_autre === 1 && <li>AUTRE TYPE DE PRISE</li>}

              {terminal.prise_type_ef === 0 &&
                terminal.prise_type_2 === 0 &&
                terminal.prise_type_combo_ccs === 0 &&
                terminal.prise_type_chademo === 0 &&
                terminal.prise_type_autre === 0 && (
                  <li>Aucun type de prise spécifié</li>
                )}
            </ul>
          </Popup>
        </Marker>
      ))}
    </MarkerClusterGroup>
  );
}

export default Cluster;
