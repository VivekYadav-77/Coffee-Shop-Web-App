import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders, updateOrAddOrder } from "../redux/slices/orderSlice.js";
import { ordersApi, analyticApi } from "../utils/api.js";
import OrderStatusTracker from "./Orderstatustracker.jsx";
import {
  Truck,
  ThumbsUp,
  CheckCircle,
  DollarSign,
  Map as MapIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import DeliveryMapModal from "./DeliveryMapModal.jsx";
const AgentDashboard = () => {
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const [agentStats, setAgentStats] = useState(null);
  const [otpValues, setOtpValues] = useState({});
  const [selectedOrderForMap, setSelectedOrderForMap] = useState(null);
  const [currentAgentLocation, setCurrentAgentLocation] = useState(null);
  const [locationError, setLocationError] = useState(false)
  const { list: allOrders } = useSelector((state) => state.orders) || {
    list: [],
  };
  const { user: currentAgent, isAuthenticated } = useSelector(
    (state) => state.user
  );

  // Effect to fetch initial orders
  useEffect(() => {
    setIsLoading(true);
    if (isAuthenticated && currentAgent?._id) {
      ordersApi
        .agentOrders(currentAgent._id)
        .then((data) => {
          if (data && Array.isArray(data.orders)) {
            dispatch(setOrders(data.orders));
          } else {
            dispatch(setOrders([]));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch agent orders:", error);
          dispatch(setOrders([]));
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [dispatch, isAuthenticated, currentAgent?._id]);

  // Effect to fetch agent analytics
  useEffect(() => {
    if (currentAgent?._id) {
      analyticApi
        .getAgentAnalytics(currentAgent._id)
        .then((data) => setAgentStats(data))
        .catch((error) => console.error("Failed to fetch agent stats:", error));
    }
  }, [currentAgent]);
  
  useEffect(() => {
  const fetchLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentAgentLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationError(false); 
      },
      (err) => {
        console.error("Geolocation Error:", err.message);
        setLocationError(true); 
      }
    );
  };

  if (!navigator.permissions) {
    console.error("Permissions API is not supported by your browser.");
    fetchLocation();
    return;
  }

  navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
    if (permissionStatus.state === "granted") {
      fetchLocation();
    } else {
      setLocationError(true);
    }

    permissionStatus.onchange = () => {
      if (permissionStatus.state === "granted") {
        fetchLocation(); 
      } else {
        setLocationError(true);
      }
    };
  });
}, []);
  
  // Effect for Live Location Tracking
  useEffect(() => {
    let intervalId = null;
    const activeDelivery = allOrders.find(
      (o) =>
        o.status === "Out for Delivery" &&
        String(o.deliveryPartner?.agentId) === String(currentAgent?._id)
    );

    if (activeDelivery && !locationError) {
      intervalId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            ordersApi.updateAgentLocation(activeDelivery._id, {
              lat: latitude,
              lng: longitude,
            });
          },
          (error) => console.error("Geolocation error:", error),
          { enableHighAccuracy: true }
        );
      }, 15000);
    }

    return () => clearInterval(intervalId);
  }, [allOrders, currentAgent,locationError]);

  // Handler to accept an order
  const handleAcceptOrder = async (orderId) => {
    if (!currentAgent?._id) return alert("Agent ID is missing.");
    const originalOrder = allOrders.find((o) => o._id === orderId);
    if (!originalOrder) return;
    const optimisticOrder = {
      ...originalOrder,
      status: "Accepted by Agent",
      deliveryPartner: { agentId: currentAgent._id, name: currentAgent.name },
    };
    dispatch(updateOrAddOrder(optimisticOrder));
    try {
      await ordersApi.acceptOrders(orderId, currentAgent._id);
    } catch (error) {
      dispatch(updateOrAddOrder(originalOrder));
      alert("Failed to accept the order.");
    }
  };

  // Handler for simple status updates (e.g., to 'Out for Delivery')
  const handleSimpleStatusUpdate = async (orderId, newStatus) => {
    const originalOrder = allOrders.find((o) => o._id === orderId);
    if (!originalOrder) return;
    const optimisticOrder = { ...originalOrder, status: newStatus };
    dispatch(updateOrAddOrder(optimisticOrder));
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      dispatch(updateOrAddOrder(originalOrder));
      alert("Failed to update status.");
    }
  };

  // Handlers for OTP form
  const handleOtpChange = (orderId, value) => {
    if (/^\d*$/.test(value) && value.length <= 4) {
      setOtpValues((prev) => ({ ...prev, [orderId]: value }));
    }
  };

  const handleDeliveryConfirmation = async (orderId) => {
    const otp = otpValues[orderId];
    if (!otp || otp.length !== 4) return alert("Please enter the 4-digit OTP.");

    const originalOrder = allOrders.find((o) => o._id === orderId);
    if (!originalOrder) return;
    const optimisticOrder = { ...originalOrder, status: "Delivered" };
    dispatch(updateOrAddOrder(optimisticOrder));
    try {
      await ordersApi.updateOrderStatus(orderId, "Delivered", otp);
    } catch (error) {
      dispatch(updateOrAddOrder(originalOrder));
      alert(error.response?.data?.message || "Failed to confirm delivery.");
    }
  };

  if (!isAuthenticated || currentAgent?.role !== "AGENT") {
    return <div className="text-center p-8 text-white">Access Denied.</div>;
  }

  const availableOrders = allOrders.filter(
    (o) => o.status === "Available for Delivery"
  );
  const myOrders = allOrders.filter(
    (o) =>
      String(o.deliveryPartner?.agentId) === String(currentAgent?._id) &&
      o.status !== "Delivered"
  );
const hasActiveOrder = myOrders.length > 0;
  const agentSteps = ["Out for Delivery", "Delivered"];
  const agentIcons = { "Out for Delivery": Truck, Delivered: ThumbsUp };

  return (
    <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Delivery Agent Dashboard
        </h1>
        {agentStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-12 bg-gray-800 p-6 rounded-lg"
          >
            <h2 className="text-2xl font-semibold mb-4">Your Performance</h2>
            <div className="flex justify-around items-center">
              <div className="text-center">
                <CheckCircle
                  className="mx-auto text-green-400 mb-2"
                  size={32}
                />
                <p className="text-3xl font-bold">
                  {agentStats.metrics.totalDeliveries}
                </p>
                <p className="text-sm text-gray-400">Total Deliveries</p>
              </div>
              <div className="text-center">
                <DollarSign
                  className="mx-auto text-yellow-400 mb-2"
                  size={32}
                />
                <p className="text-3xl font-bold">
                  ₹{agentStats.metrics.totalEarnings.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">Total Earnings</p>
              </div>
            </div>
          </motion.div>
        )}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold border-b-2 border-yellow-400 pb-2 mb-4 text-center">
            Available for Delivery
          </h2>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : availableOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableOrders.map((order) => (
                <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-lg">{order.orderId}</h3>
                  <p className="font-bold text-yellow-400">
                    Address:{" "}
                    <span className="text-orange-600">
                      {order.deliveryAddress}
                    </span>
                  </p>
                  <button
                    onClick={() => handleAcceptOrder(order._id)}
                   disabled={hasActiveOrder}
            className="mt-4 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            title={hasActiveOrder ? "You must complete your active delivery first" : "Accept this order"}
                  >
                    Accept Order
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">No available jobs right now.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold border-b-2 border-cyan-400 pb-2 mb-4 text-center">
            My Active Deliveries
          </h2>
          {isLoading ? (
            <p className="text-center">Loading...</p>
          ) : myOrders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {myOrders.map((order) => (
                <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold text-lg">{order.orderId}</h3>
                  <p className="text-gray-300">
                    Status:{" "}
                    <span className="font-semibold text-cyan-400">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-400">
                    Address: {order.deliveryAddress}
                  </p>
                  <div className="mt-4 flex flex-col space-y-2">
                    {order.status === "Accepted by Agent" && (
                      <button
                        onClick={() =>
                          handleSimpleStatusUpdate(
                            order._id,
                            "Out for Delivery"
                          )
                        }
                        className="bg-blue-500 ..."
                      >
                        Mark as Out for Delivery
                      </button>
                    )}
                    {order.status === "Out for Delivery" && (
                      <div className="flex items-center gap-2">
                        <input
                          type="tel"
                          maxLength="4"
                          placeholder="OTP"
                          value={otpValues[order._id] || ""}
                          onChange={(e) =>
                            handleOtpChange(order._id, e.target.value)
                          }
                          className="bg-gray-700 p-2 rounded-md text-center w-28 text-lg"
                        />
                        <button
                          onClick={() => handleDeliveryConfirmation(order._id)}
                          className="flex-1 bg-purple-500 ..."
                        >
                          Confirm
                        </button>
                      </div>
                    )}
                   {(order.status === "Accepted by Agent" ||
                      order.status === "Out for Delivery") && (
                      <>
                        {locationError ? (
                          <div className="mt-2 text-center bg-red-800 text-white font-semibold py-2 px-4 rounded">
                            Please enable location access to see map.
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedOrderForMap(order)}
                            disabled={!currentAgentLocation}
                            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MapIcon size={16} />
                            {currentAgentLocation ? "Show Route Map" : "Getting Location..."}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <OrderStatusTracker
                    status={order.status}
                    steps={agentSteps}
                    icons={agentIcons}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center">You have no active deliveries.</p>
          )}
        </div>
        {selectedOrderForMap && currentAgentLocation && (
          <DeliveryMapModal
            order={selectedOrderForMap}
            agentLocation={currentAgentLocation}
            onClose={() => setSelectedOrderForMap(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;
