import { useMapEvents } from "react-leaflet";

function MapLocationLeafletUser({
  setMapLimit,
  setMapZoom,
}: {
  setMapLimit: (bounds: L.LatLngBounds) => void;
  setMapZoom: (zoom: number) => void;
}) {
  const map = useMapEvents({
    moveend: () => {
      const currentLimit = map.getBounds();
      const currentZoom = map.getZoom();
      setMapLimit(currentLimit);
      setMapZoom(currentZoom);
    },
  });
  return null;
}

export default MapLocationLeafletUser;
