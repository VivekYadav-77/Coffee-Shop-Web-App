import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { disputeApi } from "../../utils/api.js";
import { motion } from "framer-motion";

export default function MyDisputes() {
    const { user } = useSelector((s) => s.user);
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDisputes();
    }, []);

    const loadDisputes = async () => {
        try {
            const res = await disputeApi.getMine();
            setDisputes(res.disputes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const map = {
            OPEN: "bg-amber-100 text-amber-800",
            UNDER_REVIEW: "bg-blue-100 text-blue-800",
            RESOLVED: "bg-emerald-100 text-emerald-800",
            DISMISSED: "bg-gray-100 text-gray-600",
        };
        return map[status] || "bg-gray-100 text-gray-800";
    };

    const getPriorityBadge = (priority) => {
        const map = {
            LOW: "border-gray-300 text-gray-600",
            MEDIUM: "border-amber-400 text-amber-700",
            HIGH: "border-orange-500 text-orange-700",
            CRITICAL: "border-red-500 text-red-700",
        };
        return map[priority] || "border-gray-300 text-gray-600";
    };

    const getTypeIcon = (type) => {
        const map = {
            FAKE_DELIVERY: "🚫",
            MISSING_ITEMS: "📦",
            WRONG_ITEMS: "❌",
            DAMAGED_ORDER: "💔",
            AGENT_ABANDONMENT: "🏃",
            EXCESSIVE_WAIT: "⏳",
            VENDOR_DELAY: "🕐",
            QUALITY_ISSUE: "👎",
            PAYMENT_ISSUE: "💳",
            OTHER: "📝",
        };
        return map[type] || "📝";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h1 className="text-3xl font-bold text-[#3b2f2f] mb-2">My Disputes</h1>
                    <p className="text-[#8b7355] mb-8">Track and manage your reported issues</p>
                </motion.div>

                {disputes.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-6xl mb-4">✅</p>
                        <p className="text-xl text-[#8b7355]">No disputes raised</p>
                        <p className="text-sm text-[#b09e86] mt-2">If you face any issues with an order, you can raise a dispute from the order details page.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {disputes.map((dispute, i) => (
                            <motion.div
                                key={dispute._id}
                                initial={{ y: 15, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-[#e8e0d4]"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{getTypeIcon(dispute.type)}</span>
                                        <div>
                                            <h3 className="font-bold text-[#3b2f2f]">{dispute.type.replace(/_/g, " ")}</h3>
                                            <p className="text-sm text-[#8b7355]">
                                                Order #{dispute.order?.orderId || "—"} • {new Date(dispute.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 border rounded-full text-xs font-semibold ${getPriorityBadge(dispute.priority)}`}>
                                            {dispute.priority}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(dispute.status)}`}>
                                            {dispute.status.replace(/_/g, " ")}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-[#5a4a3a] text-sm mb-3">{dispute.description}</p>

                                {dispute.resolution && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mt-3">
                                        <p className="text-sm font-semibold text-emerald-800 mb-1">Resolution</p>
                                        <p className="text-sm text-emerald-700">{dispute.resolution}</p>
                                        {dispute.refundAmount > 0 && (
                                            <p className="text-xs text-emerald-600 mt-1 font-medium">💰 Refund: ₹{dispute.refundAmount}</p>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
