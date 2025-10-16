import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { couponsApi } from "../utils/api.js";
import { Ticket, Copy, Check, Clock } from "lucide-react";
import { motion } from "framer-motion";

const CouponCard = ({ coupon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expires = new Date(expiryDate);
    const diffTime = expires - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = getDaysRemaining(coupon.expiresAt);
  const discountText =
    coupon.discountType === "percentage"
      ? `${coupon.value}% OFF`
      : `₹${coupon.value} OFF`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-slate-800 rounded-xl flex items-center overflow-hidden border border-slate-700"
    >
      <div className="bg-yellow-400 p-6 flex flex-col items-center justify-center text-slate-900">
        <Ticket size={32} />
        <span className="font-bold text-2xl mt-1">{discountText}</span>
      </div>
      <div className="p-4 flex-1">
        <p className="text-sm text-slate-400">Coupon Code</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="font-mono text-lg font-bold text-white bg-slate-700/50 px-2 py-1 rounded-md">
            {coupon.code}
          </p>
          <button
            onClick={handleCopy}
            className="p-2 rounded-md hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <Check size={18} className="text-green-500" />
            ) : (
              <Copy size={18} className="text-slate-400" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-sm text-red-400 mt-3">
          <Clock size={14} />
          <span>Expires in {daysRemaining} days</span>
        </div>
      </div>
    </motion.div>
  );
};

const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      couponsApi
        .getMyCoupons()
        .then((data) => setCoupons(data))
        .catch((err) => console.error("Failed to fetch coupons", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 text-white min-h-screen pt-40">
        Please log in to view your coupons.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-violet-900 to-indigo-900 text-white pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-orange-700">
            My Coupons & Rewards
          </h1>
          <p className="text-lg text-slate-400">
            Here are the special offers you've earned. Use them at checkout!
          </p>
        </header>

        {isLoading ? (
          <p className="text-center text-slate-400">Loading your coupons...</p>
        ) : coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {coupons.map((coupon) => (
              <CouponCard key={coupon._id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="text-center bg-slate-800 p-10 rounded-lg">
            <Ticket size={48} className="mx-auto text-slate-500 mb-4" />
            <h3 className="text-xl font-bold">No Coupons Yet</h3>
            <p className="text-slate-400 mt-2">
              Spin the wheel or keep an eye out for special promotions to earn
              rewards!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCouponsPage;
