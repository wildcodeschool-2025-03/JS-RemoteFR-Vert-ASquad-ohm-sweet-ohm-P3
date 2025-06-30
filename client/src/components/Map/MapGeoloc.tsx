import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";

function LocationMarker() {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMapEvents({
    click() {
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position}>
      <Popup>Vous êtes ici !</Popup>
    </Marker>
  );
}

export default LocationMarker;
