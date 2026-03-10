import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { vendorApi, cartApi } from "../../utils/api.js";
import { addToCart } from "../../redux/slices/cartSlice.js";
import { motion } from "framer-motion";

export default function VendorStorefront() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((s) => s.user);
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVendor();
    }, [id]);

    const loadVendor = async () => {
        try {
            setLoading(true);
            const [vRes, mRes] = await Promise.all([
                vendorApi.getById(id),
                vendorApi.getMenu(id, { category: category || undefined }),
            ]);
            setVendor(vRes.vendor);
            setProducts(mRes.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        if (!isAuthenticated) return navigate("/login");
        try {
            dispatch(addToCart({
                _id: product._id,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
                inStock: product.inStock,
                quantity: 1,
                vendorId: id,
            }));
            await cartApi.add(product._id, 1, id);
        } catch (err) {
            console.error(err);
        }
    };

    const categories = [...new Set(products.map((p) => p.category))];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#6b4226] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
                <p className="text-xl text-[#8b7355]">Vendor not found</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#faf8f5]">
            {/* Vendor Banner */}
            <div className="bg-gradient-to-br from-[#3b2f2f] via-[#5a4234] to-[#6b4226] text-white">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <motion.div initial={{ y: -15, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl border border-white/20">
                            {vendor.logoUrl ? <img src={vendor.logoUrl} alt="" className="w-full h-full rounded-2xl object-cover" /> : "☕"}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{vendor.storeName}</h1>
                            <p className="text-[#d4c5b0] mt-1">{vendor.description || "Delicious food, delivered fast."}</p>
                            <div className="flex items-center gap-4 mt-2 text-sm text-[#d4c5b0]">
                                <span>⭐ {(vendor.rating || 0).toFixed(1)}</span>
                                <span>⏱️ {vendor.estimatedPrepTime} min</span>
                                <span className={vendor.isOpen ? "text-emerald-400" : "text-red-400"}>
                                    {vendor.isOpen ? "● Open" : "● Closed"}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Category Filter */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setCategory("")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${!category ? "bg-[#6b4226] text-white" : "bg-white text-[#8b7355] border border-[#e8e0d4] hover:border-[#c8926b]"
                            }`}
                    >
                        All
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c}
                            onClick={() => setCategory(c)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap capitalize transition-all ${category === c ? "bg-[#6b4226] text-white" : "bg-white text-[#8b7355] border border-[#e8e0d4] hover:border-[#c8926b]"
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-5xl mb-4">📋</p>
                        <p className="text-lg text-[#8b7355]">No items available</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {products
                            .filter((p) => !category || p.category === category)
                            .map((product, i) => (
                                <motion.div
                                    key={product._id}
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8e0d4] group hover:shadow-md transition-all"
                                >
                                    <div className="h-44 bg-gradient-to-br from-[#e8e0d4] to-[#d4c5b0] flex items-center justify-center relative">
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                                        ) : (
                                            <span className="text-5xl">☕</span>
                                        )}
                                        {!product.inStock && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="text-white font-bold text-lg">Out of Stock</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-[#3b2f2f] text-base">{product.name}</h3>
                                        <p className="text-xs text-[#8b7355] mt-0.5 capitalize">{product.category}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="text-xl font-bold text-[#6b4226]">₹{product.price}</span>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.inStock || !vendor.isOpen}
                                                className="px-4 py-2 bg-[#6b4226] hover:bg-[#5a3620] disabled:bg-[#d4c5b0] text-white rounded-lg text-sm font-medium transition-all"
                                            >
                                                Add +
                                            </button>
                                        </div>
                                        {product.rating > 0 && (
                                            <p className="text-xs text-[#b09e86] mt-2">⭐ {product.rating.toFixed(1)} ({product.numReviews})</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
