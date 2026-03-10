import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { disputeApi } from "../../utils/api.js";
import { motion } from "framer-motion";

const DISPUTE_TYPES = [
    { value: "MISSING_ITEMS", label: "Missing Items", icon: "📦" },
    { value: "WRONG_ITEMS", label: "Wrong Items", icon: "❌" },
    { value: "DAMAGED_ORDER", label: "Damaged / Spilled", icon: "💔" },
    { value: "QUALITY_ISSUE", label: "Quality Issue", icon: "👎" },
    { value: "FAKE_DELIVERY", label: "Fake Delivery", icon: "🚫" },
    { value: "EXCESSIVE_WAIT", label: "Excessive Wait Time", icon: "⏳" },
    { value: "PAYMENT_ISSUE", label: "Payment Issue", icon: "💳" },
    { value: "OTHER", label: "Other", icon: "📝" },
];

export default function RaiseDispute() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId") || "";
    const navigate = useNavigate();

    const [form, setForm] = useState({
        orderId,
        type: "",
        description: "",
        againstRole: "VENDOR",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.orderId || !form.type || !form.description) {
            setError("Please fill all fields");
            return;
        }

        try {
            setSubmitting(true);
            setError("");
            await disputeApi.raise(form);
            setSuccess(true);
            setTimeout(() => navigate("/my-disputes"), 2000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to raise dispute");
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-10 shadow-lg border border-[#e8e0d4] text-center max-w-md"
                >
                    <p className="text-6xl mb-4">✅</p>
                    <h2 className="text-2xl font-bold text-[#3b2f2f] mb-2">Dispute Raised</h2>
                    <p className="text-[#8b7355]">Our team will review your case and resolve it as quickly as possible.</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            <div className="max-w-2xl mx-auto px-4 py-8">
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                    <h1 className="text-3xl font-bold text-[#3b2f2f] mb-2">Report an Issue</h1>
                    <p className="text-[#8b7355] mb-8">We take your complaints seriously. Fill in the details below.</p>
                </motion.div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-[#e8e0d4] space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">{error}</div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-[#3b2f2f] mb-2">Order ID</label>
                        <input
                            type="text"
                            value={form.orderId}
                            onChange={(e) => setForm({ ...form, orderId: e.target.value })}
                            placeholder="Enter your Order ID"
                            className="w-full px-4 py-3 rounded-xl border border-[#e8e0d4] bg-[#faf8f5] focus:outline-none focus:border-[#6b4226] transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#3b2f2f] mb-3">Issue Type</label>
                        <div className="grid grid-cols-2 gap-3">
                            {DISPUTE_TYPES.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setForm({ ...form, type: t.value })}
                                    className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2 ${form.type === t.value
                                        ? "border-[#6b4226] bg-[#f5efe8] text-[#3b2f2f]"
                                        : "border-[#e8e0d4] text-[#8b7355] hover:border-[#c8926b]"
                                        }`}
                                >
                                    <span>{t.icon}</span>
                                    <span className="text-sm font-medium">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#3b2f2f] mb-2">Against</label>
                        <select
                            value={form.againstRole}
                            onChange={(e) => setForm({ ...form, againstRole: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-[#e8e0d4] bg-[#faf8f5] focus:outline-none focus:border-[#6b4226]"
                        >
                            <option value="VENDOR">Vendor / Restaurant</option>
                            <option value="AGENT">Delivery Agent</option>
                            <option value="SYSTEM">Platform / System</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-[#3b2f2f] mb-2">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            rows={4}
                            placeholder="Describe the issue in detail..."
                            className="w-full px-4 py-3 rounded-xl border border-[#e8e0d4] bg-[#faf8f5] focus:outline-none focus:border-[#6b4226] resize-none transition-colors"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 bg-[#6b4226] hover:bg-[#5a3620] disabled:bg-[#b09e86] text-white rounded-xl font-semibold transition-all"
                    >
                        {submitting ? "Submitting..." : "Submit Dispute"}
                    </button>
                </form>
            </div>
        </div>
    );
}
