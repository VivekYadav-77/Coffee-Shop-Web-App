import { useState, useEffect } from "react";
import { disputeApi } from "../../utils/api.js";
import { motion } from "framer-motion";

export default function AdminDisputes() {
    const [disputes, setDisputes] = useState([]);
    const [filter, setFilter] = useState({ status: "", priority: "" });
    const [loading, setLoading] = useState(true);
    const [resolveModal, setResolveModal] = useState(null);
    const [resolution, setResolution] = useState({ resolution: "", refundAmount: 0, status: "RESOLVED" });

    useEffect(() => {
        loadDisputes();
    }, [filter]);

    const loadDisputes = async () => {
        try {
            setLoading(true);
            const res = await disputeApi.getAll(filter);
            setDisputes(res.disputes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async () => {
        if (!resolveModal) return;
        try {
            await disputeApi.resolve(resolveModal._id, resolution);
            setResolveModal(null);
            setResolution({ resolution: "", refundAmount: 0, status: "RESOLVED" });
            await loadDisputes();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatusBadge = (status) => ({
        OPEN: "bg-amber-100 text-amber-800",
        UNDER_REVIEW: "bg-blue-100 text-blue-800",
        RESOLVED: "bg-emerald-100 text-emerald-800",
        DISMISSED: "bg-gray-100 text-gray-600",
    }[status] || "bg-gray-100 text-gray-800");

    const getPriorityColor = (priority) => ({
        LOW: "border-l-gray-400",
        MEDIUM: "border-l-amber-400",
        HIGH: "border-l-orange-500",
        CRITICAL: "border-l-red-500",
    }[priority] || "border-l-gray-400");

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h1 className="text-3xl font-bold text-[#3b2f2f] mb-2">Dispute Management</h1>
                    <p className="text-[#8b7355] mb-6">Review and resolve customer complaints</p>
                </motion.div>

                {/* Filters */}
                <div className="flex gap-3 mb-6 flex-wrap">
                    <select
                        value={filter.status}
                        onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-[#e8e0d4] bg-white text-[#3b2f2f] focus:outline-none focus:border-[#6b4226]"
                    >
                        <option value="">All Status</option>
                        <option value="OPEN">Open</option>
                        <option value="UNDER_REVIEW">Under Review</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="DISMISSED">Dismissed</option>
                    </select>
                    <select
                        value={filter.priority}
                        onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
                        className="px-4 py-2.5 rounded-xl border border-[#e8e0d4] bg-white text-[#3b2f2f] focus:outline-none focus:border-[#6b4226]"
                    >
                        <option value="">All Priority</option>
                        <option value="CRITICAL">Critical</option>
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>
                </div>

                {/* Disputes List */}
                <div className="space-y-4">
                    {disputes.length === 0 ? (
                        <div className="text-center py-16 text-[#8b7355]">
                            <p className="text-5xl mb-4">🎉</p>
                            <p className="text-lg">No disputes to review</p>
                        </div>
                    ) : (
                        disputes.map((dispute, i) => (
                            <motion.div
                                key={dispute._id}
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.04 }}
                                className={`bg-white rounded-2xl p-6 shadow-sm border border-[#e8e0d4] border-l-4 ${getPriorityColor(dispute.priority)}`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-bold text-[#3b2f2f]">{dispute.type.replace(/_/g, " ")}</h3>
                                        <p className="text-sm text-[#8b7355]">
                                            Raised by: {dispute.raisedBy?.name} ({dispute.raisedByRole}) •
                                            Against: {dispute.againstRole} •
                                            Order: #{dispute.order?.orderId}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(dispute.status)}`}>
                                        {dispute.status.replace(/_/g, " ")}
                                    </span>
                                </div>

                                <p className="text-sm text-[#5a4a3a] mb-4">{dispute.description}</p>

                                {dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW" ? (
                                    <button
                                        onClick={() => setResolveModal(dispute)}
                                        className="px-4 py-2 bg-[#6b4226] hover:bg-[#5a3620] text-white rounded-lg text-sm font-medium transition-all"
                                    >
                                        Resolve
                                    </button>
                                ) : dispute.resolution ? (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
                                        <strong>Resolution:</strong> {dispute.resolution}
                                        {dispute.refundAmount > 0 && <span className="ml-2">(Refund: ₹{dispute.refundAmount})</span>}
                                    </div>
                                ) : null}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Resolve Modal */}
            {resolveModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-[#3b2f2f] mb-4">Resolve Dispute</h2>
                        <p className="text-sm text-[#8b7355] mb-4">{resolveModal.type.replace(/_/g, " ")} — {resolveModal.description}</p>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-semibold text-[#3b2f2f]">Resolution</label>
                                <textarea
                                    value={resolution.resolution}
                                    onChange={(e) => setResolution({ ...resolution, resolution: e.target.value })}
                                    rows={3}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#e8e0d4] focus:outline-none focus:border-[#6b4226] resize-none"
                                    placeholder="Describe the resolution..."
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#3b2f2f]">Refund Amount (₹)</label>
                                <input
                                    type="number"
                                    value={resolution.refundAmount}
                                    onChange={(e) => setResolution({ ...resolution, refundAmount: parseInt(e.target.value) || 0 })}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#e8e0d4] focus:outline-none focus:border-[#6b4226]"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-[#3b2f2f]">Status</label>
                                <select
                                    value={resolution.status}
                                    onChange={(e) => setResolution({ ...resolution, status: e.target.value })}
                                    className="w-full mt-1 px-4 py-3 rounded-xl border border-[#e8e0d4] focus:outline-none focus:border-[#6b4226]"
                                >
                                    <option value="RESOLVED">Resolved</option>
                                    <option value="DISMISSED">Dismissed</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setResolveModal(null)} className="flex-1 py-3 bg-gray-100 text-[#3b2f2f] rounded-xl font-medium hover:bg-gray-200 transition-all">
                                Cancel
                            </button>
                            <button onClick={handleResolve} className="flex-1 py-3 bg-[#6b4226] text-white rounded-xl font-medium hover:bg-[#5a3620] transition-all">
                                Confirm
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
