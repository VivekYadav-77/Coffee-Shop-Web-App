import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const CreamyLatte = ({ onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  const item = {
    id: 3,
    name: 'Creamy Latte',
    description: 'Silky steamed milk blended with our premium espresso for a luxurious, velvety cup.',
    price: '₹500',
    emoji: '🥛',
    imageUrl: '/Creamy latte.png'
  }

  return (
    <div className="coffee-detail-page">
      <div className="coffee-detail-container">
        <div className="coffee-detail-header">
          <button className="back-btn" onClick={onBack}><ArrowLeft size={20} /></button>
          <h1 className="coffee-detail-title">{item.name}</h1>
        </div>
        <div className="coffee-detail-content">
          <div className="coffee-visual">
            <div className="coffee-image-frame">
              <img className="coffee-image-placeholder" src={item.imageUrl} alt={`${item.name} image`} />
            </div>
          </div>
          <div className="coffee-info-card">
            <h2>About this coffee</h2>
            <p>Balanced espresso and steamed milk create a creamy body with gentle sweetness—comfort in a cup.</p>
            <div className="coffee-meta">
              <div className="meta-item"><span className="meta-label">Roast</span><span className="meta-value">Medium</span></div>
              <div className="meta-item"><span className="meta-label">Notes</span><span className="meta-value">Toffee, Biscuit</span></div>
              <div className="meta-item"><span className="meta-label">Size</span><span className="meta-value">300ml</span></div>
            </div>
            <div className="coffee-purchase">
              <div className="coffee-price">{item.price}</div>
              {currentQuantity > 0 ? (
                <div className="quantity-controls">
                  <button className="quantity-btn minus" onClick={() => onUpdateQuantity(item.id, -1)}><Minus size={16} /></button>
                  <span className="quantity-display">{currentQuantity}</span>
                  <button className="quantity-btn plus" onClick={() => onUpdateQuantity(item.id, 1)}><Plus size={16} /></button>
                </div>
              ) : (
                <button className="order-now-btn" onClick={() => onAddToCart(item)}><span>Add to Cart</span></button>
              )}
            </div>
            <div className="brew-tips">
              <h3>Barista Tips</h3>
              <ul>
                <li>Steam milk to 60–65°C for optimal sweetness and texture.</li>
                <li>Pour slowly for a consistent microfoam.</li>
                <li>Try oat milk for a nutty, naturally sweet variation.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreamyLatte



