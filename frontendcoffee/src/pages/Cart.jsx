import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../redux/slices/cartSlice.js";
import { cartApi } from "../utils/api.js";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const backendaddress = import.meta.env.VITE_API_URL;

  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.user);
  const isCheckoutDisabled = items.some((item) => !item.isAvailable);

  const handleUpdateQuantity = async (_id, newQuantity) => {
    if (newQuantity === 0) {
      await cartApi.removeFromCart(_id);
      dispatch(removeFromCart(_id));
    } else {
      await cartApi.updateQuantity(_id, newQuantity);
      dispatch(updateQuantity({ _id, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = async (_id) => {
    await cartApi.removeFromCart(_id);
    dispatch(removeFromCart(_id));
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      await cartApi.clearCart();
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const shippingFee = 50.0;
  const taxRate = 0.05;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + shippingFee + taxAmount;
  const getImageUrl = (url) => {
        if (!url) return ''; 
        if (url.startsWith('http')) {
            return url; 
        }
        return `${backendaddress}${url}`; 
    };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-slide-in-bottom">
            <ShoppingBag className="h-24 w-24 text-white/30 mx-auto mb-6" />
            <h1 className="text-4xl font-extrabold mb-4">Your Cart is Empty</h1>
            <p className="text-lg text-white/70 mb-8">
              Looks like you haven't added any delicious coffee yet.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-full hover:scale-105 transition-transform"
            >
              <ShoppingBag size={20} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 p-3 rounded-xl transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold [text-shadow:0_0_30px_rgba(255,107,107,0.4)]">
            Your Cart
          </h1>
          <button
            onClick={handleClearCart}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 transition-colors hover:bg-red-500/30"
          >
            <Trash2 size={18} />
            <span className="hidden sm:inline">Clear Cart</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <div
                key={item._id}
                className="bg-black/20 border border-white/15 rounded-2xl p-4 sm:p-6 backdrop-blur-xl flex items-center gap-4 animate-slide-in-bottom transition-all hover:border-white/25 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
              >
                <img
                  src={getImageUrl(item.imageUrl)}
                  alt={item.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl flex-shrink-0"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  {!item.isAvailable && (
                    <span className="text-xs bg-red-500 text-white font-bold px-2 py-1 rounded-full">
                      OUT OF STOCK
                    </span>
                  )}
                  <p className="text-yellow-400 text-sm">
                    ₹{item.price.toFixed(2)} each
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
                  <div className="flex items-center gap-2 bg-white/10 p-1 rounded-full">
                    <button
                      disabled={!item.isAvailable}
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity - 1)
                      }
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-8 text-center font-bold">
                      {item.quantity}
                    </span>
                    <button
                      disabled={!item.isAvailable}
                      onClick={() =>
                        handleUpdateQuantity(item._id, item.quantity + 1)
                      }
                      className="p-2 bg-white/10 hover:bg-white/20 rounded-full"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="font-bold text-lg w-24 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="p-2 text-red-400/70 hover:text-red-400 hover:bg-red-500/20 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-black/30 border border-white/15 rounded-2xl p-6 backdrop-blur-xl sticky top-32 animate-slide-in-bottom"
              style={{ animationDelay: "0.2s", opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-center mb-6">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6 text-white/80">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span className="font-medium text-white">
                    ₹{totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-medium text-white">
                    ₹{shippingFee.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span className="font-medium text-white">
                    ₹{taxAmount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-6"></div>
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
              <button
                disabled={isCheckoutDisabled}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold py-3 px-4 rounded-full hover:scale-105 transition-transform"
              >
                <CreditCard size={20} />
                <span>
                  {isCheckoutDisabled
                    ? "Item Unavailable"
                    : "Proceed to Checkout"}
                </span>{" "}
              </button>
              {!isAuthenticated && (
                <div className="mt-4 p-3 bg-orange-500/20 border border-orange-500/30 rounded-lg text-center text-orange-300 text-sm">
                  <p>💡 Sign in to save your cart and track orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
