import React from 'react'
import { ArrowLeft, Plus, Minus, Trash2, ShoppingBag, CreditCard } from 'lucide-react'

const CartPage = ({ 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart, 
  onBackToMenu, 
  onCheckout, 
  isUserLoggedIn,
  cartTotal 
}) => {

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <button className="back-btn" onClick={onBackToMenu}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="cart-title">Your Cart</h1>
          </div>

          <div className="empty-cart">
            <div className="empty-cart-icon">
              <ShoppingBag size={80} />
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any delicious coffee to your cart yet.</p>
            <button className="continue-shopping-btn" onClick={onBackToMenu}>
              <ShoppingBag size={20} />
              <span>Continue Shopping</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <button className="back-btn" onClick={onBackToMenu}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="cart-title">Your Cart</h1>
          <button className="clear-cart-btn" onClick={onClearCart}>
            <Trash2 size={18} />
            <span>Clear Cart</span>
          </button>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <div 
                key={item.id} 
                className="cart-item"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="cart-item-image">
                  <span className="cart-item-emoji">{item.emoji}</span>
                </div>
                
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-description">{item.description}</p>
                  <div className="cart-item-price">{item.price}</div>
                </div>

                <div className="cart-item-controls">
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn minus"
                      onClick={() => onUpdateQuantity(item.id, -1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn plus"
                      onClick={() => onUpdateQuantity(item.id, 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  
                  <div className="item-total">
                    ₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}
                  </div>
                  
                  <button 
                    className="remove-item-btn"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{cartTotal > 0 ? '₹50' : 'Free'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{Math.round(cartTotal * 0.05).toLocaleString()}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(cartTotal + (cartTotal > 0 ? 50 : 0) + Math.round(cartTotal * 0.05)).toLocaleString()}</span>
              </div>

              <button 
                className="checkout-btn"
                onClick={onCheckout}
              >
                <CreditCard size={20} />
                <span>Proceed to Checkout</span>
              </button>

              {!isUserLoggedIn && (
                <div className="login-reminder">
                  <p>💡 Sign in to save your cart and track orders</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage