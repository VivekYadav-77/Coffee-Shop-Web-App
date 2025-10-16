import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { ordersApi } from "../utils/api";
import L from "leaflet";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

const DeliveryMapModal = ({ order, agentLocation, onClose }) => {
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (order && agentLocation) {
      ordersApi
        .getDeliveryRoute(order._id, agentLocation)
        .then((data) => setPath(data.path))
        .catch((err) => console.error("Failed to fetch route", err))
        .finally(() => setLoading(false));
    }
  }, [order, agentLocation]);

  const customerPosition = [
    order.deliveryLocation.lat,
    order.deliveryLocation.lng,
  ];
  const agentPosition = [agentLocation.lat, agentLocation.lng];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000] p-4">
      <div className="bg-slate-800 p-4 rounded-lg w-full max-w-2xl text-white">
        <h3 className="font-bold text-lg mb-2">
          Route to {order.deliveryAddress}
        </h3>
        <div className="h-[400px] w-full rounded-md overflow-hidden z-0">
          {loading ? (
            <p>Calculating route...</p>
          ) : (
            <MapContainer
              bounds={[agentPosition, customerPosition]}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={agentPosition}>
                <Popup>Your Location</Popup>
              </Marker>
              <Marker position={customerPosition}>
                <Popup>Customer</Popup>
              </Marker>
              {path.length > 0 && (
                <Polyline positions={path} color="#FBBF24" weight={5} />
              )}
            </MapContainer>
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-500 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          Close Map
        </button>
      </div>
    </div>
  );
};

export default DeliveryMapModal;
