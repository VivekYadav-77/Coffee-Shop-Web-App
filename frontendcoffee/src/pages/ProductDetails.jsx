import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ArrowLeft, Plus, Minus, Star } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice.js";
import { productsApi, cartApi } from "../utils/api.js";
import { setSelectedItem } from "../redux/slices/menuSlice.js";
import StarRating from "./Starrating.jsx";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const backendaddress = import.meta.env.VITE_API_URL;

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const selectedProduct = useSelector((state) => state.menu.selectedItem);

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (productId) {
      productsApi.getProductById(productId).then((productData) => {
        if (productData) {
          dispatch(setSelectedItem(productData));
        }
      });
    }
    return () => {
      dispatch(setSelectedItem(null));
    };
  }, [productId, dispatch]);
  const handleAddToCart = async () => {
    if (selectedProduct) {
      if (user) {
        dispatch(addToCart({ ...selectedProduct, quantity }));
        await cartApi.addToCart(selectedProduct._id, quantity);
        alert(`Added ${quantity} ${selectedProduct.name}(s) to cart!`);
      } else {
        navigate("/login");
      }
    }
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    try {
      const updatedProduct = await productsApi.submitReview(productId, {
        rating,
        comment,
      });

      dispatch(setSelectedItem(updatedProduct));

      alert("Review submitted successfully!");
      setRating(0);
      setComment("");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to submit review.");
    }
  };

  if (!selectedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-product-detail text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  const hasUserReviewed = selectedProduct.reviews?.some(
    (review) => review.user?._id === user?._id
  );

  return (
    <div className="min-h-screen bg-product-detail text-white pt-28 md:pt-32 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-4 mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex-shrink-0 p-2 rounded-full transition-colors hover:bg-white/10"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-center [text-shadow:0_0_30px_rgba(255,107,107,0.4)]">
            {selectedProduct.name}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 lg:gap-14 items-start">
          {/* Visual Side */}
          <div className="bg-black/20 border border-white/15 rounded-3xl p-6 md:p-12 backdrop-blur-xl">
            <div className="aspect-square bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-3 shadow-2xl">
              <img
                className="w-full h-full rounded-xl object-cover"
                src={`${backendaddress}${selectedProduct.imageUrl}`}
                alt={selectedProduct.name}
              />
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-black/20 border border-white/15 rounded-3xl p-6 md:p-12 backdrop-blur-xl">
            <h2 className="text-3xl font-bold mb-2">About this coffee</h2>

            <div className="flex items-center gap-3 mb-5">
              <StarRating rating={selectedProduct.rating} size={20} />
              <span className="text-white/60 text-sm">
                ({selectedProduct.numReviews || 0} Reviews)
              </span>
            </div>

            <p className="text-white/80 leading-relaxed mb-8">
              {selectedProduct.description}
            </p>

            {/* Meta Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-white/60">Roast Level</span>
                <span className="text-base font-bold">
                  {selectedProduct.roastLevel}
                </span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-sm text-white/60">Category</span>
                <span className="text-base font-bold">
                  {selectedProduct.category}
                </span>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="flex flex-col sm:flex-row items-center gap-5 my-8">
              <div className="text-yellow-400 font-bold text-4xl">
                ₹{selectedProduct.price.toFixed(2)}
              </div>
              <div className="flex-grow w-full sm:w-auto">
                {user &&
                  user.role !== "ADMIN" &&
                  user.role !== "AGENT" &&
                  (selectedProduct.inStock ? (
                    <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg w-full justify-between">
                      <span className="pl-2 font-medium">Quantity</span>
                      <div className="flex items-center bg-black/20 rounded">
                        <button
                          className="p-2 transition-colors hover:bg-white/20"
                          onClick={decreaseQuantity}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-bold">
                          {quantity}
                        </span>
                        <button
                          className="p-2 transition-colors hover:bg-white/20"
                          onClick={increaseQuantity}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ) : null)}
              </div>
            </div>

            {user &&
              user.role !== "ADMIN" &&
              user.role !== "AGENT" &&
              (selectedProduct.inStock ? (
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-amber-500 hover:bg-amber-600 transition-colors text-black font-bold py-4 px-6 rounded-lg text-lg"
                >
                  Add {quantity} to Cart - ₹
                  {(selectedProduct.price * quantity).toFixed(2)}
                </button>
              ) : (
                <div className="w-full text-center bg-red-500/50 border border-red-500 text-white font-bold py-4 px-6 rounded-lg">
                  Out of Stock
                </div>
              ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold border-b border-white/20 pb-4 mb-8">
            Customer Reviews
          </h2>

          <div className="space-y-6 mb-12">
            {selectedProduct.reviews?.length === 0 && (
              <p className="text-white/60">No reviews yet. Be the first!</p>
            )}
            {selectedProduct.reviews?.map((review) => (
              <div key={review._id} className="border-b border-white/10 pb-4">
                <p className="font-bold">{review.user?.name || "Anonymous"}</p>
                <div className="my-1">
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-white/80 mt-2">{review.comment}</p>
                <p className="text-xs text-white/40 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          {isAuthenticated && !hasUserReviewed && (
            <div>
              <h3 className="text-2xl font-bold mb-4">Write Your Review</h3>
              <form
                onSubmit={handleReviewSubmit}
                className="space-y-4 bg-black/20 p-6 rounded-lg"
              >
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`cursor-pointer transition-colors ${
                          rating >= star
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600 hover:text-yellow-500"
                        }`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Your Comment
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="bg-yellow-500 text-black font-bold py-2 px-6 rounded-lg"
                >
                  Submit
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
