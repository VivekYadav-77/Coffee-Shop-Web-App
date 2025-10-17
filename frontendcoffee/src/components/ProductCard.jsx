import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice.js";
import { cartApi } from "../utils/api.js";
import StarRating from "../pages/Starrating.jsx";
const backendaddress = import.meta.env.VITE_API_URL
const ProductCard = ({ product, animationDelay }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  // State and refs for the temporary "Added!" button state
  const [isAdded, setIsAdded] = useState(false);
  const timerRef = useRef(null);

  // Effect to clean up the timer if the component unmounts
  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
if (!user) {
      navigate("/login");
      return;
    }
    if (isAdded) return;

    if (user&&user.role === "CUSTOMER") {
      try {
        await cartApi.addToCart(product._id, 1);
        dispatch(addToCart(product));

        setIsAdded(true);
        timerRef.current = setTimeout(() => {
          setIsAdded(false);
        }, 2000);
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <Link to={`/product/${product._id}`} className="group h-full">
      <div
        className="bg-slate-900/20 backdrop-blur-xl border border-white/15 rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col group-hover:border-white/25 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-black/40 animate-slide-in-bottom"
        style={{ animationDelay, opacity: 0 }}
      >
        <div className="h-48 flex items-center justify-center overflow-hidden relative">
          <img
            src={`${backendaddress}${product.imageUrl}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <div className="p-6 flex flex-col flex-grow text-white">
          <h3 className="text-xl font-bold mb-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={product.rating} />
            <span className="text-xs text-white/50">
              ({product.numReviews} reviews)
            </span>
          </div>
          <p className="text-white/70 text-sm mb-4 flex-grow line-clamp-2">
            {product.description}
          </p>
          <div
            className="font-bold text-2xl text-[#ffd23f] mb-4"
            style={{ textShadow: "0 2px 10px #ffd23f4c" }}
          >
            ₹{product.price.toFixed(2)}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto">
            <button className="w-full py-3 px-2 rounded-xl text-sm font-semibold bg-transparent border-2 border-white/30 text-white transition-all hover:border-white/60 hover:bg-white/10">
              Learn More
            </button>
            {user?.role !== "ADMIN" && user?.role !== "AGENT" && (
              <button
                onClick={(e)=>handleAddToCart(e,product)}
                disabled={!product.inStock || isAdded}
                className={`w-full py-3 px-2 rounded-xl text-sm font-semibold text-white transition-all duration-300
                  ${
                    isAdded
                      ? "bg-gradient-to-br from-green-500 to-teal-500 scale-105"
                      : "bg-gradient-to-br from-[#ff6b6b] to-[#ff8e3c] hover:shadow-lg hover:shadow-[#ff6b6b]/40 hover:scale-105"
                  }
                  disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100`}
              >
                {isAdded
                  ? "Added!"
                  : product.inStock
                  ? "Add to Cart"
                  : "Out of Stock"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
