import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMenuItems } from "../redux/slices/menuSlice.js";
import { productsApi } from "../utils/api.js";
import { Search } from "lucide-react";
import { addToCart } from "../redux/slices/cartSlice.js";
import { cartApi } from "../utils/api.js";
const MenuPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: menuItems } = useSelector((state) => state.menu) || {
    items: [],
  };
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const backendaddress = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const selectedProduct = useSelector((state) => state.menu.selectedItem);

  const categories = [
    "All",
    "coffee",
    "tea",
    "snacks",
    "dessert",
    "shake",
    "cookie",
  ];
  const handleAddToCart = async (product) => {
    if (user) {
      try {
        await cartApi.addToCart(product._id, 1);
        dispatch(addToCart(product));
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    productsApi
      .getAllProducts()
      .then((data) => {
        if (data && Array.isArray(data.products)) {
          dispatch(setMenuItems(data.products));
        }
      })
      .catch((error) => console.error("Failed to fetch products:", error))
      .finally(() => setIsLoading(false));
  }, [dispatch]);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === "All" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, searchTerm, activeCategory]);

  return (
    <div className="min-h-screen  text-white pt-28 pb-16 bg-gradient-to-br  from-black via-violet-900 to-indigo-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">Our Menu</h1>
          <p className="text-lg text-slate-400">
            Discover your new favorite coffee.
          </p>
        </header>

        {/* Filter and Search Controls */}
        <div className="sticky top-24 z-10  py-4 mb-8 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search for an item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-12 pr-4 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 w-full overflow-x-auto no-scrollbar pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                    activeCategory === category
                      ? "bg-orange-500 text-slate-900"
                      : "bg-slate-700/50 hover:bg-slate-700"
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="text-center text-gray-400 py-16">Loading menu...</div>
        ) : (
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                    className="bg-slate-800 rounded-lg overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/10 hover:-translate-y-2"
                  >
                    <div className="relative">
                      <img
                        src={`${backendaddress}${item.imageUrl}`}
                        alt={item.name}
                        className="w-full h-56 object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <p className="text-xs text-yellow-400 font-semibold uppercase">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-white mt-1">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-2 flex-grow">
                        {item.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-xl font-bold text-white">
                          ₹{item.price}
                        </p>
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={!item.inStock}
                          className="w-1/3 py-3 px-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-[#ff6b6b] to-[#ff8e3c] text-white transition-all hover:shadow-lg hover:shadow-[#ff6b6b]/40 hover:scale-105 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed"
                        >
                          {item.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-slate-500">
                  No items match your search.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MenuPage;
