import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ordersApi, couponsApi, cartApi } from "../utils/api";
import { clearCart } from "../redux/slices/cartSlice";
import { serviceArea } from "../LocationData/location";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  User,
  CheckCircle,
  Ticket,
} from "lucide-react";

//  Sub-Component for Step 1: Delivery Info
const DeliveryInfoStep = ({
  formData,
  handleInputChange,
  handleLocationChange,
  errors,
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="flex items-center gap-3 text-xl font-semibold mb-6">
      <User size={24} /> Delivery Information
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="flex flex-col">
        <label className="text-sm text-slate-400 mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className="bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        />
        {errors.firstName && (
          <span className="text-red-400 text-xs mt-1">{errors.firstName}</span>
        )}
      </div>
      <div className="flex flex-col">
        <label className="text-sm text-slate-400 mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className="bg-slate-700 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
        />
      </div>
    </div>
    <div className="mt-6">
      <label className="text-sm font-medium text-slate-400 mb-1 block">
        Delivery Location
      </label>
      <select
        onChange={handleLocationChange}
        defaultValue=""
        className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:outline-none"
      >
        <option value="" disabled>
          -- Select a delivery location --
        </option>
        {serviceArea.map((loc) => (
          <option key={loc.name} value={loc.name}>
            {loc.name}
          </option>
        ))}
      </select>
      {errors.location && (
        <span className="text-red-400 text-xs mt-1">{errors.location}</span>
      )}
    </div>
  </motion.div>
);

// Sub-Component for Step 2: Payment
const PaymentStep = ({ paymentMethod, setPaymentMethod }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    transition={{ duration: 0.3 }}
  >
    <h2 className="flex items-center gap-3 text-xl font-semibold mb-6">
      <CreditCard size={24} /> Payment Information
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {["card", "upi", "cod"].map((method) => (
        <div
          key={method}
          onClick={() => setPaymentMethod(method)}
          className={`border-2 p-4 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            paymentMethod === method
              ? "border-yellow-400 bg-yellow-400/10"
              : "border-slate-600 hover:border-slate-500"
          }`}
        >
          {method === "card" && <CreditCard />}
          {method === "upi" && <Smartphone />}
          {method === "cod" && <Building />}
          <span className="text-sm font-semibold capitalize">{method}</span>
        </div>
      ))}
    </div>
    {paymentMethod === "cod" && (
      <p className="text-center text-slate-400 mt-6">
        You can pay in cash when your order arrives.
      </p>
    )}
  </motion.div>
);

// Sub-Component for Order Summary
const OrderSummary = ({
  cartItems,
  totalAmount,
  coupons,
  appliedCoupon,
  discount,
  SHIPPING_FEE,
  taxAmount,
  finalTotal,
  handleApplyCoupon,
  handleRemoveCoupon,
  handleNext,
  step,
  isLoading,
}) => (
  <div className="bg-slate-800 rounded-lg p-6 sticky top-28">
    <h3 className="text-xl font-semibold mb-4 border-b border-slate-700 pb-2">
      Order Summary
    </h3>
    <div className="space-y-2 mb-4">
      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center text-slate-300 text-sm"
        >
          <span>
            {item.name} x {item.quantity}
          </span>
          <span className="font-medium">₹{item.price * item.quantity}</span>
        </div>
      ))}
    </div>
    <div className="border-t border-slate-700 pt-4 space-y-2 text-sm">
      <div className="flex justify-between text-slate-300">
        <span>Subtotal</span>
        <span>₹{totalAmount.toFixed(2)}</span>
      </div>
      {appliedCoupon && (
        <div className="flex justify-between text-green-400">
          <span>Discount ({appliedCoupon.code})</span>
          <span>- ₹{discount.toFixed(2)}</span>
          <button onClick={handleRemoveCoupon} className="text-xs text-red-400">
            (Remove)
          </button>
        </div>
      )}
      <div className="flex justify-between text-slate-300">
        <span>Shipping Fee</span>
        <span>₹{SHIPPING_FEE.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-slate-300">
        <span>Tax (5%)</span>
        <span>₹{taxAmount.toFixed(2)}</span>
      </div>
    </div>
    <div className="flex justify-between text-lg font-bold text-white mt-4 border-t border-slate-700 pt-4">
      <span>Total</span>
      <span>₹{finalTotal.toFixed(2)}</span>
    </div>
    {step === 1 && (
      <div className="border-t border-slate-700 pt-4 mt-4">
        <h4 className="font-semibold mb-2 flex items-center gap-2">
          <Ticket size={16} /> Available Coupons
        </h4>
        {coupons.length > 0 && !appliedCoupon ? (
          <div className="space-y-2 max-h-24 overflow-y-auto">
            {coupons.map((c) => (
              <div
                key={c._id}
                className="bg-slate-700/50 p-2 rounded-md flex justify-between items-center"
              >
                <span className="text-sm font-mono">{c.code}</span>
                <button
                  onClick={() => handleApplyCoupon(c.code)}
                  className="text-xs bg-yellow-500 text-black font-bold px-2 py-1 rounded"
                >
                  Apply
                </button>
              </div>
            ))}
          </div>
        ) : appliedCoupon ? (
          <p className="text-sm text-green-400">Coupon applied!</p>
        ) : (
          <p className="text-sm text-slate-500">No coupons available.</p>
        )}
      </div>
    )}
    <button
      onClick={handleNext}
      disabled={isLoading}
      className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait"
    >
      {isLoading
        ? "Processing..."
        : step === 1
        ? "Continue to Payment"
        : "Place Order"}
    </button>
  </div>
);

// Main Checkout Page Component
const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount } = useSelector((state) => state.cart);
  const { user: currentUser, isAuthenticated } = useSelector(
    (state) => state.user
  );

  const SHIPPING_FEE = 50;
  const TAX_RATE = 0.05;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    paymentMethod: "card",
  });
  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        firstName: currentUser.name?.split(" ")[0] || "",
        lastName: currentUser.name?.split(" ")[1] || "",
        email: currentUser.email || "",
      }));
    }
    if (isAuthenticated) {
      couponsApi.getMyCoupons().then(setCoupons).catch(console.error);
    }
  }, [currentUser, isAuthenticated]);

  const subtotalAfterDiscount = totalAmount - discount;
  const taxAmount = subtotalAfterDiscount * TAX_RATE;
  const finalTotal = subtotalAfterDiscount + taxAmount + SHIPPING_FEE;

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleLocationChange = (e) => {
    const locationName = e.target.value;
    const locationObject = serviceArea.find((loc) => loc.name === locationName);
    setSelectedLocation(locationObject);
    if (errors.location) setErrors((prev) => ({ ...prev, location: "" }));
  };

  const handleApplyCoupon = async (code) => {
    try {
      const result = await couponsApi.applyCoupon(code, totalAmount);
      setAppliedCoupon(result.coupon);
      setDiscount(result.discountAmount);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!selectedLocation)
      newErrors.location = "Please select a delivery location.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) processOrder();
  };

  const processOrder = async () => {
    setIsProcessing(true);
    const orderDataPayload = {
      customer: currentUser._id,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        cost: item.cost || 0,
      })),
      totalAmount: finalTotal,
      couponCode: appliedCoupon ? appliedCoupon.code : null,
      deliveryAddress: selectedLocation.name,
      deliveryLocation: {
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      },
    };
    try {
      await ordersApi.placeOrder(orderDataPayload);
      await cartApi.clearCart();
      dispatch(clearCart());
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Could not place your order.");
      setStep(2);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Please log in to checkout.
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center p-8">
          {isProcessing ? (
            <>
              <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h2 className="text-2xl font-bold mt-6">
                Processing Your Order...
              </h2>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
              <h1 className="text-3xl font-bold">Order Confirmed!</h1>
              <p className="text-slate-300 mt-2">
                Your delicious coffee is on its way.
              </p>
              <button
                onClick={() => navigate("/my-orders")}
                className="mt-6 bg-yellow-500 text-slate-900 font-bold py-2 px-6 rounded-lg"
              >
                Track Your Order
              </button>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pt-16">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => (step === 1 ? navigate("/cart") : setStep(1))}
            className="p-2 rounded-full hover:bg-slate-700"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-8 h-8 flex items-center justify-center font-bold rounded-full transition-all ${
                  step >= s
                    ? "bg-yellow-400 text-slate-900"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {s}
              </div>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-800 p-6 rounded-lg">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <DeliveryInfoStep
                  key="step1"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  handleLocationChange={handleLocationChange}
                  errors={errors}
                />
              ) : (
                <PaymentStep
                  key="step2"
                  paymentMethod={formData.paymentMethod}
                  setPaymentMethod={(method) =>
                    setFormData((prev) => ({ ...prev, paymentMethod: method }))
                  }
                />
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              totalAmount={totalAmount}
              coupons={coupons}
              appliedCoupon={appliedCoupon}
              discount={discount}
              SHIPPING_FEE={SHIPPING_FEE}
              taxAmount={taxAmount}
              finalTotal={finalTotal}
              handleApplyCoupon={handleApplyCoupon}
              handleRemoveCoupon={handleRemoveCoupon}
              handleNext={handleNext}
              step={step}
              isLoading={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
