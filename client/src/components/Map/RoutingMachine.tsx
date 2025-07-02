import "leaflet-routing-machine";
import "./RoutingMachine.css";
import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

function RoutingMachine() {
  const map = useMap();

  useEffect(() => {
    if (!map) {
      return;
    }

    const routingControl = L.Routing.control({
      waypoints: [L.latLng(50.63, 3.06), L.latLng(48.86, 2.33)],
    }).addTo(map);

    return () => {
      map.removeControl(routingControl);
    };
  }, [map]);

  return null;
}

export default RoutingMachine;
