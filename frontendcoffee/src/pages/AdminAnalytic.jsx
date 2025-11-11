import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { DollarSign, ShoppingBag, BarChart2, TrendingUp } from "lucide-react";
import { analyticApi } from "../utils/api.js";
const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const { user: currentAdmin, isAuthenticated } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    analyticApi
      .getAdminAnalytics()
      .then((responseData) => setData(responseData))
      .catch((error) =>
        console.error("Failed to fetch admin analytics:", error)
      );
  }, []);

  if (!isAuthenticated || currentAdmin?.role !== "ADMIN") {
    return <div className="text-center p-8 text-white">Access Denied.</div>;
  }
  if (!data) {
    return (
      <div className="text-center p-8 text-white">Loading Analytics...</div>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1 } }),
  };

  const avgOrderValue =
    data.metrics.totalOrders > 0
      ? Math.round(data.metrics.totalRevenue / data.metrics.totalOrders)
      : 0;

  return (
    <div className="min-h-screen  text-white pt-28 pb-16 bg-product-detail">
      <h1 className="text-4xl font-extrabold mb-8">Business Analytics</h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        initial="hidden"
        animate="visible"
      >
        <motion.div
          custom={0}
          variants={cardVariants}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <DollarSign className="text-green-400 mb-2" size={32} />
          <p className="text-sm text-gray-400">Total Revenue</p>
          <p className="text-3xl font-bold">
            ₹{data.metrics.totalRevenue.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          custom={1}
          variants={cardVariants}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <TrendingUp className="text-blue-400 mb-2" size={32} />
          <p className="text-sm text-gray-400">Total Profit</p>
          <p className="text-3xl font-bold">
            ₹{data.metrics.totalProfit.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          custom={2}
          variants={cardVariants}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <ShoppingBag className="text-blue-400 mb-2" size={32} />
          <p className="text-sm text-gray-400">Total Orders</p>
          <p className="text-3xl font-bold">{data.metrics.totalOrders}</p>
        </motion.div>
        <motion.div
          custom={3}
          variants={cardVariants}
          className="bg-gray-800 p-6 rounded-lg"
        >
          <BarChart2 className="text-purple-400 mb-2" size={32} />
          <p className="text-sm text-gray-400">Avg. Order Value</p>
          <p className="text-3xl font-bold">
            ₹{avgOrderValue.toLocaleString()}
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold mb-4">Sales - Last 7 Days</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.salesLast7Days}>
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
            <XAxis dataKey="day" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1A202C", border: "none" }}
              cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
            />
            <Bar
              dataKey="sales"
              name="Sales (₹)"
              fill="#FBBF24"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default AdminAnalytics;
