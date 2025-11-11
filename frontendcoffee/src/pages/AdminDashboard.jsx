import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOrders, updateOrAddOrder } from "../redux/slices/orderSlice.js";
import { ordersApi } from "../utils/api.js";
import OrderStatusTracker from "./Orderstatustracker.jsx";
import { Package, Zap, CheckCircle, Truck, Star, ThumbsUp } from "lucide-react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const orders = useSelector((state) => state.orders.list) || [];
  const { user: currentAdmin, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (orders.length === 0) {
      setIsLoading(true);
      ordersApi
        .adminOrders()
        .then((data) => {
          if (data && Array.isArray(data.orders)) {
            dispatch(setOrders(data.orders));
          } else {
            dispatch(setOrders([]));
          }
        })
        .catch((error) => {
          console.error(error);
          dispatch(setOrders([]));
        })
        .finally(() => setIsLoading(false));
    }
  }, [dispatch, orders.length]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const originalOrder = orders.find((o) => o._id === orderId);
    if (!originalOrder) return;

    const optimisticOrder = { ...originalOrder, status: newStatus };
    dispatch(updateOrAddOrder(optimisticOrder));

    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
      dispatch(updateOrAddOrder(originalOrder));
    }
  };

  if (!isAuthenticated || currentAdmin?.role !== "ADMIN") {
    return <div className="text-center p-8 text-white">Access Denied.</div>;
  }
  const allSteps = [
    "Confirmed",
    "Preparing",
    "Packed",
    "Available for Delivery",
    "Accepted by Agent",
    "Out for Delivery",
    "Delivered",
  ];
  const stepIcons = {
    Confirmed: Zap,
    Preparing: Package,
    Packed: CheckCircle,
    "Available for Delivery": Star,
    "Accepted by Agent": ThumbsUp,
    "Out for Delivery": Truck,
    Delivered: CheckCircle,
  };
  return (
    <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-8">
          Admin Dashboard
        </h1>
        {isLoading ? (
          <div className="text-center text-gray-400">Loading orders...</div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg font-bold text-white">
                    Order {order.orderId}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span className="font-semibold text-yellow-400">
                      {order.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Address:{" "}
                    <span className="text-gray-300">
                      {order.deliveryAddress}
                    </span>
                  </p>
                </div>
                <div className="flex-shrink-0 w-full sm:w-auto">
                  {order.status === "Confirmed" && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, "Preparing")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "Preparing" && (
                    <button
                      onClick={() => handleStatusUpdate(order._id, "Packed")}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Mark as Packed
                    </button>
                  )}
                  {order.status === "Packed" && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, "Available for Delivery")
                      }
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors"
                    >
                      Notify Agents
                    </button>
                  )}
                </div>
                <OrderStatusTracker
                  status={order.status}
                  steps={allSteps}
                  icons={stepIcons}
                  orderTime={order.createdAt}
                />
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                <p>No active orders yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
