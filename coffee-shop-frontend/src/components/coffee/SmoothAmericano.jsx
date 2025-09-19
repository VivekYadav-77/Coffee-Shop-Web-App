import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const SmoothAmericano = ({ onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  const item = {
    id: 2,
    name: 'Smooth Americano',
    description: 'Espresso diluted with hot water for a smooth, all-day sip with clarity and balance.',
    price: '₹350',
    emoji: '☕',
    imageUrl: '/Smooth americano.png'
  }

  return (
    <div className="coffee-detail-page">
      <div className="coffee-detail-container">
        <div className="coffee-detail-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
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
            <p>
              A gentler cup built from espresso and hot water, preserving aroma with a clean finish. Ideal when you want
              the essence of espresso in a longer, comforting drink.
            </p>

            <div className="coffee-meta">
              <div className="meta-item"><span className="meta-label">Roast</span><span className="meta-value">Medium</span></div>
              <div className="meta-item"><span className="meta-label">Notes</span><span className="meta-value">Nutty, Cocoa</span></div>
              <div className="meta-item"><span className="meta-label">Size</span><span className="meta-value">240ml</span></div>
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
                <li>Use 1:2 espresso to water for a rich profile; 1:3 for lighter.</li>
                <li>Preheat the cup to retain heat and aroma.</li>
                <li>Try with a dash of lemon zest for a bright twist.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmoothAmericano



