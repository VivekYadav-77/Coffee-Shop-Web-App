import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders } from "../redux/slices/orderSlice.js";
import { ordersApi } from "../utils/api.js";

import OrderStatusTracker from "./Orderstatustracker.jsx";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { socket } from "../utils/socket.js";
import { motion, AnimatePresence } from "framer-motion";

import { Package, Zap, CheckCircle, Truck, ThumbsUp } from "lucide-react";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

//  Live Map Sub-Component
const LiveTrackingMap = ({ order }) => {
  const [agentLocation, setAgentLocation] = useState(
    order.deliveryPartner?.location || null
  );
  useEffect(() => {
    const handleLocationUpdate = (data) => {
      if (data.orderId === order._id) setAgentLocation(data.location);
    };
    socket.on("location_update", handleLocationUpdate);
    return () => socket.off("location_update", handleLocationUpdate);
  }, [order._id]);

  if (!agentLocation?.lat)
    return (
      <p className="text-sm text-gray-400 mt-4 text-center">
        Waiting for agent's location...
      </p>
    );
  return (
    <div className="mt-4 z-0">
      <MapContainer
        center={[agentLocation.lat, agentLocation.lng]}
        zoom={15}
        style={{ height: "250px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[agentLocation.lat, agentLocation.lng]}>
          <Popup>{order.deliveryPartner.name} is on the way!</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

// Main MyOrders Component
const MyOrders = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("live");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const allOrders = useSelector((state) => state.orders.list) || [];
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (isAuthenticated && currentUser?._id) {
      setIsLoading(true);
      ordersApi
        .customerOrders(currentUser._id)
        .then((data) => {
          if (data && Array.isArray(data.orders))
            dispatch(setOrders(data.orders));
          else dispatch(setOrders([]));
        })
        .catch((error) => dispatch(setOrders([])))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, currentUser?._id, isAuthenticated]);

  // Filter orders into 'live' and 'past' lists on the client-side
  const liveOrders = useMemo(
    () => allOrders.filter((o) => o.status !== "Delivered"),
    [allOrders]
  );
  const pastOrders = useMemo(() => {
    return allOrders.filter((o) => {
      if (o.status !== "Delivered") return false;
      if (dateRange.start && new Date(o.createdAt) < new Date(dateRange.start))
        return false;
      if (
        dateRange.end &&
        new Date(o.createdAt) >
          new Date(new Date(dateRange.end).setHours(23, 59, 59, 999))
      )
        return false;
      return true;
    });
  }, [allOrders, dateRange]);

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 text-white min-h-screen pt-40">
        Please log in to see your orders.
      </div>
    );
  }

  const customerSteps = [
    "Confirmed",
    "Preparing",
    "Packed",
    "Out for Delivery",
    "Delivered",
  ];
  const stepIcons = {
    Confirmed: Zap,
    Preparing: Package,
    Packed: CheckCircle,
    "Out for Delivery": Truck,
    Delivered: ThumbsUp,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-violet-900 to-indigo-900 text-white">
      <div className="max-w-4xl mx-auto py-28 px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold mb-2">My Orders</h1>
          <p className="text-lg text-slate-400">
            Track your current orders or browse your history.
          </p>
        </header>

        {/* --- Tab Buttons to switch views --- */}
        <div className="flex justify-center mb-8 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("live")}
            className={`w-1/2 py-2 font-semibold rounded-md transition-colors ${
              activeTab === "live"
                ? "bg-orange-500 text-slate-900"
                : "hover:bg-slate-700"
            } mr-7`}
          >
            Live Orders
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`w-1/2 py-2 font-semibold rounded-md transition-colors ${
              activeTab === "history"
                ? "bg-orange-500 text-slate-900"
                : "hover:bg-slate-700"
            } ml-7`}
          >
            Past Orders
          </button>
        </div>

        {isLoading ? (
          <p>Loading orders...</p>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "live" ? (
              <motion.div
                key="live"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {liveOrders.length > 0 ? (
                  <div className="space-y-6">
                    {liveOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        steps={customerSteps}
                        icons={stepIcons}
                      />
                    ))}
                  </div>
                ) : (
                  <p>You have no active orders.</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-slate-800 p-4 rounded-lg mb-6 flex items-center gap-4">
                  <input
                    type="date"
                    name="start"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    className="bg-slate-700 p-2 rounded-md"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    name="end"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    className="bg-slate-700 p-2 rounded-md"
                  />
                </div>
                {pastOrders.length > 0 ? (
                  <div className="space-y-4">
                    {pastOrders.map((order) => (
                      <OrderCard
                        key={order._id}
                        order={order}
                        steps={customerSteps}
                        icons={stepIcons}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No past orders found for this date range.</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

//  Order Card Component (reusable for both tabs)
const OrderCard = ({ order, steps, icons }) => (
  <motion.div
    layout
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="bg-slate-800 p-6 rounded-xl shadow-lg"
  >
    <div className="flex justify-between items-center mb-2">
      <h2 className="font-bold text-lg text-white">{order.orderId}</h2>
      <p className="font-bold text-lg text-white">₹{order.totalAmount}</p>
    </div>
    <p className="text-sm text-slate-400 mb-4">
      Ordered: {new Date(order.createdAt).toLocaleString()}
    </p>
    <OrderStatusTracker
      status={order.status}
      steps={steps}
      icons={icons}
      simplifyView={true}
      updatedAt={order.updatedAt}
      orderTime={order.createdAt}
    />
    {order.deliveryPartner?.name && (
      <p>Delivery by: {order.deliveryPartner.name}</p>
    )}
    {(order.status === "Accepted by Agent" ||
      order.status === "Out for Delivery") && (
      <div className="mt-4 bg-slate-900 p-3 rounded-lg text-center">
        <p className="text-sm">Share this OTP with the delivery agent:</p>
        <p className="text-2xl font-bold tracking-widest text-yellow-400">
          {order.deliveryOtp}
        </p>
      </div>
    )}
    {order.status === "Out for Delivery" && <LiveTrackingMap order={order} />}
  </motion.div>
);

export default MyOrders;
