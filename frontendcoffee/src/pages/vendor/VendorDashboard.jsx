import { useState, useEffect } from "react";
import { vendorApi, ordersApi } from "../../utils/api.js";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function VendorDashboard() {
    const { user } = useSelector((s) => s.user);
    const [vendor, setVendor] = useState(null);
    const [orders, setOrders] = useState([]);
    const [tab, setTab] = useState("incoming");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            if (user?.vendorProfile) {
                const v = await vendorApi.getById(user.vendorProfile);
                setVendor(v.vendor);
            }
            const res = await ordersApi.getVendorOrders();
            setOrders(res.orders || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (orderId, action) => {
        try {
            if (action === "accept") await ordersApi.vendorAccept(orderId);
            else if (action === "prepare") await ordersApi.vendorPrepare(orderId);
            else if (action === "ready") await ordersApi.vendorReady(orderId);
            else if (action === "cancel") await ordersApi.vendorCancel(orderId, "Vendor cancelled");
            await loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleShop = async () => {
        try {
            const res = await vendorApi.toggleStatus();
            setVendor((prev) => ({ ...prev, isOpen: res.isOpen }));
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            Placed: "bg-amber-100 text-amber-800",
            "Accepted by Vendor": "bg-blue-100 text-blue-800",
            Preparing: "bg-orange-100 text-orange-800",
            "Available for Delivery": "bg-emerald-100 text-emerald-800",
            Delivered: "bg-green-100 text-green-800",
            Cancelled: "bg-red-100 text-red-800",
        };
        return colors[status] || "bg-gray-100 text-gray-800";
    };

    const filteredOrders = orders.filter((o) => {
        if (tab === "incoming") return ["Placed"].includes(o.status);
        if (tab === "active") return ["Accepted by Vendor", "Preparing", "Available for Delivery"].includes(o.status);
        if (tab === "completed") return ["Delivered", "Cancelled"].includes(o.status);
        return true;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-[#3b2f2f]">{vendor?.storeName || "My Kitchen"}</h1>
                        <p className="text-[#8b7355] mt-1">Manage your orders and menu</p>
                    </div>
                    <button
                        onClick={toggleShop}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${vendor?.isOpen
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                    >
                        {vendor?.isOpen ? "🟢 Shop Open" : "🔴 Shop Closed"}
                    </button>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {[
                        { label: "Total Orders", value: vendor?.totalOrders || 0, icon: "📦" },
                        { label: "Rating", value: `${(vendor?.rating || 0).toFixed(1)} ⭐`, icon: "⭐" },
                        { label: "Prep Time", value: `${vendor?.estimatedPrepTime || 20} min`, icon: "⏱️" },
                    ].map((stat) => (
                        <motion.div
                            key={stat.label}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e0d4]"
                        >
                            <p className="text-sm text-[#8b7355] mb-1">{stat.label}</p>
                            <p className="text-2xl font-bold text-[#3b2f2f]">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm border border-[#e8e0d4] w-fit">
                    {["incoming", "active", "completed"].map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-5 py-2.5 rounded-lg font-medium capitalize transition-all ${tab === t ? "bg-[#6b4226] text-white shadow" : "text-[#8b7355] hover:bg-[#f5efe8]"
                                }`}
                        >
                            {t} ({orders.filter((o) => {
                                if (t === "incoming") return o.status === "Placed";
                                if (t === "active") return ["Accepted by Vendor", "Preparing", "Available for Delivery"].includes(o.status);
                                return ["Delivered", "Cancelled"].includes(o.status);
                            }).length})
                        </button>
                    ))}
                </div>

                {/* Orders */}
                <div className="space-y-4">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 text-[#8b7355]">
                            <p className="text-5xl mb-4">📋</p>
                            <p className="text-lg">No {tab} orders</p>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <motion.div
                                key={order._id}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e0d4]"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="font-bold text-[#3b2f2f] text-lg">{order.orderId}</h3>
                                        <p className="text-sm text-[#8b7355]">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-[#5a4a3a]">{item.name} × {item.quantity}</span>
                                            <span className="font-medium text-[#3b2f2f]">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-[#e8e0d4] pt-2 flex justify-between font-bold text-[#3b2f2f]">
                                        <span>Total</span>
                                        <span>₹{order.totalAmount}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 flex-wrap">
                                    {order.status === "Placed" && (
                                        <>
                                            <button onClick={() => handleAction(order._id, "accept")} className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-all">
                                                ✅ Accept
                                            </button>
                                            <button onClick={() => handleAction(order._id, "cancel")} className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all">
                                                ❌ Reject
                                            </button>
                                        </>
                                    )}
                                    {order.status === "Accepted by Vendor" && (
                                        <button onClick={() => handleAction(order._id, "prepare")} className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all">
                                            🍳 Start Preparing
                                        </button>
                                    )}
                                    {order.status === "Preparing" && (
                                        <button onClick={() => handleAction(order._id, "ready")} className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all">
                                            📦 Mark Ready
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
