import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { analyticApi } from "../utils/api.js";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

const AdminOrderHistory = () => {
  const [history, setHistory] = useState({ orders: [], totalPages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);

  const { user: currentAdmin, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    setIsLoading(true);
    analyticApi
      .getAdminOrderHistory(page)
      .then((data) => {
        setHistory(data);
      })
      .catch((error) => console.error("Failed to fetch order history:", error))
      .finally(() => setIsLoading(false));
  }, [page]);

  if (!isAuthenticated || currentAdmin?.role !== "ADMIN") {
    return <div className="text-center p-8 text-white">Access Denied.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-white">
            Order History
          </h1>
          <Link to="/admin" className="text-sm text-yellow-400 hover:underline">
            Back to Active Orders
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Loading history...</p>
        ) : history.orders.length > 0 ? (
          <div className="space-y-4">
            {history.orders.map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 p-4 rounded-lg opacity-70"
              >
                <div className="flex justify-between items-center">
                  <h2 className="font-bold text-white">{order.orderId}</h2>
                  <span className="text-sm text-gray-400">
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  <p>Customer: {order.customer?.name || "N/A"}</p>
                  <p className="font-semibold text-right">
                    Total: ₹{order.totalAmount}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No completed orders found.</p>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="font-semibold">
            Page {page + 1} of {history.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page + 1 >= history.totalPages}
            className="p-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderHistory;
