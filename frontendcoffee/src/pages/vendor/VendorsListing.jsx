import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { vendorApi } from "../../utils/api.js";
import { motion } from "framer-motion";

export default function VendorsListing() {
    const [vendors, setVendors] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadVendors();
    }, []);

    const loadVendors = async () => {
        try {
            setLoading(true);
            const res = await vendorApi.list({ search: search || undefined });
            setVendors(res.vendors || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadVendors();
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
            {/* Hero */}
            <div className="bg-gradient-to-br from-[#3b2f2f] via-[#5a4234] to-[#6b4226] text-white py-16 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        Discover Local Restaurants
                    </motion.h1>
                    <motion.p
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-[#d4c5b0] text-lg mb-8"
                    >
                        Fresh food from your favorite local vendors, delivered fast.
                    </motion.p>

                    <form onSubmit={handleSearch} className="max-w-lg mx-auto flex gap-3">
                        <input
                            type="text"
                            placeholder="Search restaurants..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-5 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/50 backdrop-blur"
                        />
                        <button type="submit" className="px-6 py-3.5 bg-[#c8926b] hover:bg-[#b07d58] text-white rounded-xl font-semibold transition-all">
                            Search
                        </button>
                    </form>
                </div>
            </div>

            {/* Vendors Grid */}
            <div className="max-w-7xl mx-auto px-4 py-10">
                {vendors.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">🏪</p>
                        <p className="text-xl text-[#8b7355]">No restaurants found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vendors.map((vendor, i) => (
                            <motion.div
                                key={vendor._id}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => navigate(`/vendor/${vendor._id}`)}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8e0d4] cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all group"
                            >
                                <div className="h-40 bg-gradient-to-br from-[#d4c5b0] to-[#e8e0d4] flex items-center justify-center relative">
                                    {vendor.logoUrl ? (
                                        <img src={vendor.logoUrl} alt={vendor.storeName} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl">☕</span>
                                    )}
                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold ${vendor.isOpen ? "bg-emerald-500 text-white" : "bg-gray-400 text-white"
                                        }`}>
                                        {vendor.isOpen ? "Open" : "Closed"}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold text-[#3b2f2f] group-hover:text-[#6b4226] transition-colors">
                                        {vendor.storeName}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-2 text-sm text-[#8b7355]">
                                        <span>⭐ {(vendor.rating || 0).toFixed(1)}</span>
                                        <span>•</span>
                                        <span>⏱️ {vendor.estimatedPrepTime || 20} min</span>
                                        <span>•</span>
                                        <span>{vendor.totalOrders || 0} orders</span>
                                    </div>
                                    <div className="flex gap-2 mt-3 flex-wrap">
                                        {(vendor.cuisine || []).slice(0, 3).map((c) => (
                                            <span key={c} className="px-2.5 py-1 bg-[#f5efe8] text-[#6b4226] rounded-full text-xs font-medium capitalize">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
