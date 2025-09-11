import React, { useState, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import axios from "axios";
const MenuGrid = ({
  onCoffeeClick,
  onAddToCart,
  cartItems,
  onUpdateQuantity,
}) => {
  const [visibleCards, setVisibleCards] = useState([]);
  const [coffeeItems, setcoffeeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  /*const coffeeItems = [
    { 
      id: 1, 
      name: "Classic Espresso", 
      description: "Rich, bold, and intense. Our signature espresso shot with notes of dark chocolate and caramel that awakens your senses.", 
      price: "₹250", 
      emoji: "☕"
    },
    { 
      id: 2, 
      name: "Smooth Americano", 
      description: "A perfect balance of strength and smoothness. Espresso with hot water for all-day sipping pleasure.", 
      price: "₹350", 
      emoji: "☕"
    },
    { 
      id: 3, 
      name: "Creamy Latte", 
      description: "Silky steamed milk meets our premium espresso for a luxurious coffee experience that melts in your mouth.", 
      price: "₹500", 
      emoji: "🥛"
    },
    { 
      id: 4, 
      name: "Frothy Cappuccino", 
      description: "Traditional Italian cappuccino with the perfect foam-to-coffee ratio and rich, authentic flavor.", 
      price: "₹450", 
      emoji: "☕"
    },
    { 
      id: 5, 
      name: "Decadent Mocha", 
      description: "Rich chocolate syrup meets premium coffee in this indulgent sweet treat that satisfies every craving.", 
      price: "₹500", 
      emoji: "🍫"
    },
    { 
      id: 6, 
      name: "Elegant Macchiato", 
      description: "Espresso marked with a dollop of foamed milk. Simple perfection in every carefully crafted sip.", 
      price: "₹450", 
      emoji: "⭐"
    },
    { 
      id: 7, 
      name: "Cold Brew", 
      description: "Smooth, refreshing, and naturally sweet. Perfect iced coffee for hot summer days and chill moments.", 
      price: "₹350", 
      emoji: "🧊"
    },
    { 
      id: 8, 
      name: "Iced Frappé", 
      description: "Blended iced coffee with whipped cream and rich flavor. A cool refreshing treat for any time of day.", 
      price: "₹550", 
      emoji: "🥤"
    },
    { 
      id: 9, 
      name: "Flat White", 
      description: "Smooth microfoam and double shot espresso. A modern coffee classic from down under with perfect balance.", 
      price: "₹450", 
      emoji: "☕"
    }
  ]*/

  useEffect(() => {
    axios
      .get("/api/product")
      .then((res) => {
        console.log("getting the reposnse", res.data.products);
        setcoffeeItems(res.data.products);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    if (!coffeeItems || coffeeItems.length === 0) return; // ✅ guard
    const timer = setInterval(() => {
      setVisibleCards((prev) => {
        if (prev.length < coffeeItems.length) {
          return [...prev, prev.length];
        }
        clearInterval(timer);
        return prev;
      });
    }, 200);

    return () => clearInterval(timer);
  }, [coffeeItems]);
  const handleCardClick = (coffeeName) => {
    onCoffeeClick(`coffee-${coffeeName.replace(/\s+/g, "-").toLowerCase()}`);
  };

  const handleLearnMore = (e, coffeeName) => {
    e.stopPropagation();
    onCoffeeClick(`coffee-${coffeeName.replace(/\s+/g, "-").toLowerCase()}`);
  };

  const handleAddToCart = (e, item) => {
    e.stopPropagation();
    onAddToCart(item);
  };

  const handleQuantityChange = (e, itemId, change) => {
    e.stopPropagation();
    onUpdateQuantity(itemId, change);
  };

  const getItemQuantity = (itemId) => {
    const cartItem = cartItems.find((item) => item._id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  return (
    <section className="menu-section" id="menu">
      <h2 className="section-title slide-in-bottom">Our Coffee Collection</h2>
      <p
        className="section-subtitle slide-in-bottom"
        style={{ animationDelay: "0.2s" }}
      >
        Expertly crafted coffee drinks, made fresh daily with premium
        ingredients sourced from the world's finest coffee growing regions
      </p>

      <div className="menu-grid">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading coffees...</p>//TODO:WE need to add a loader animation here 
          </div>
        ) : coffeeItems.length === 0 ? (
          <p>No coffee items available.</p>
        ) : (
          coffeeItems.map((item, index) => {
            const quantity = getItemQuantity(item._id);

            return (
              <div
                key={item._id}
                className={`coffee-card ${
                  visibleCards.includes(index) ? "slide-in-bottom" : ""
                }`}
                style={{
                  opacity: visibleCards.includes(index) ? 1 : 0,
                  animationDelay: `${index * 0.15}s`,
                }}
                onClick={() => handleCardClick(item.name)}
              >
                <div  className="coffee-image w-full h-44 flex items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                  <img src={`/api${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="coffee-info">
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  <div className="price">{`₹${item.price}`}</div>
                  <div className="card-buttons">
                    <button
                      className="learn-more-btn"
                      onClick={(e) => handleLearnMore(e, item.name)}
                    >
                      <span>Learn More</span>
                    </button>

                    {quantity === 0 ? (
                      <button
                        className="order-now-btn"
                        onClick={(e) => handleAddToCart(e, item)}
                      >
                        <span>Order Now</span>
                      </button>
                    ) : (
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn minus"
                          onClick={(e) => handleQuantityChange(e, item._id, -1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity-display">{quantity}</span>
                        <button
                          className="quantity-btn plus"
                          onClick={(e) => handleQuantityChange(e, item._id, 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default MenuGrid;
