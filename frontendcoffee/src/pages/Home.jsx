import { useRef } from "react";
import { useSelector } from "react-redux";
import { ChevronDown, Coffee } from "lucide-react";
import ProductCard from "../components/ProductCard.jsx";

const Home = () => {
  const menuRef = useRef(null);

  const { items: products, isLoading } = useSelector((state) => state.menu);

  const handleExploreClick = () => {
    menuRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-product-detail">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-product-detail text-white">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col justify-center items-center text-center p-4 overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-[radial-gradient(circle,rgba(139,69,19,0.1)_0%,transparent_70%)] rounded-full animate-coffee-float"></div>
        <div className="absolute bottom-[15%] right-[15%] w-60 h-60 bg-[radial-gradient(ellipse,rgba(210,180,140,0.12)_0%,transparent_70%)] rounded-full animate-coffee-float [animation-direction:reverse]"></div>

        <div className="relative z-10 max-w-4xl animate-slide-in-bottom">
          <h1
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            style={{ textShadow: "0 10px 30px #00000080" }}
          >
            Welcome to{" "}
            <span className="animate-title-glow bg-gradient-to-br from-[#ff6b6b] via-[#ff8e3c] to-[#ffd23f] bg-clip-text text-transparent">
              The Roasting House
            </span>
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90"
            style={{ textShadow: "0 2px 10px #0000004c" }}
          >
            Experience the finest coffee crafted with passion, served with love.
            From premium beans to perfect brewing, every cup tells a story of
            excellence.
          </p>
          <button
            onClick={handleExploreClick}
            className="bg-gradient-to-br from-[#f4674b] to-[#ff8e3c] text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#ff6b6b]/40"
          >
            Explore Menu
          </button>
        </div>

        <div
          onClick={handleExploreClick}
          className="absolute bottom-8 z-10 flex flex-col items-center cursor-pointer group"
        >
          <span className="mb-2 uppercase text-sm tracking-widest group-hover:text-white transition-colors text-white/80">
            Scroll
          </span>
          <ChevronDown size={24} className="animate-bounce-slow" />
        </div>
      </section>

      {/* Products Section */}
      <section
        ref={menuRef}
        id="menu"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-6xl font-extrabold text-white mb-4 animate-slide-in-bottom"
            style={{ textShadow: "0 10px 30px #0000004c" }}
          >
            Our Coffee Collection
          </h2>
          <p
            className="text-lg text-white/80 max-w-3xl mx-auto mb-16 animate-slide-in-bottom"
            style={{ animationDelay: "0.2s" }}
          >
            Expertly crafted coffee drinks, made fresh daily with premium
            ingredients sourced from the world's finest coffee growing regions.
          </p>

          {products.length === 0 ? (
            <div className="py-12 text-white/50">
              <Coffee className="h-16 w-16 mx-auto mb-4" />
              <p>No products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  animationDelay={`${index * 0.1}s`}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
