import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const ClassicEspresso = ({ onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  const item = {
    id: 1,
    name: 'Classic Espresso',
    description:
      'Rich, bold, and intense espresso with notes of dark chocolate and caramel. A pure shot of coffee perfection.',
    price: '₹250',
    emoji: '☕',
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
              <img 
                className="coffee-image-placeholder" 
                src="/espresso.png" 
                alt="Classic Espresso image"
                loading="lazy"
                decoding="async"
                width="520"
                height="520"
              />
            </div>
          </div>

          <div className="coffee-info-card">
            <h2>About this coffee</h2>
            <p>
              Our Classic Espresso is extracted with precision for a balanced body and aromatic crema. Perfect neat or as
              the base for your favorite milk beverages.
            </p>

            <div className="coffee-meta">
              <div className="meta-item">
                <span className="meta-label">Roast</span>
                <span className="meta-value">Medium-Dark</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Notes</span>
                <span className="meta-value">Dark Chocolate, Caramel</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Size</span>
                <span className="meta-value">Single Shot (30ml)</span>
              </div>
            </div>

            <div className="coffee-purchase">
              <div className="coffee-price">{item.price}</div>

              {currentQuantity > 0 ? (
                <div className="quantity-controls">
                  <button className="quantity-btn minus" onClick={() => onUpdateQuantity(item.id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span className="quantity-display">{currentQuantity}</span>
                  <button className="quantity-btn plus" onClick={() => onUpdateQuantity(item.id, 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button className="order-now-btn" onClick={() => onAddToCart(item)}>
                  <span>Add to Cart</span>
                </button>
              )}
            </div>

            <div className="brew-tips">
              <h3>Barista Tips</h3>
              <ul>
                <li>Best served immediately after extraction at 90–96°C.</li>
                <li>Pair with a glass of sparkling water to cleanse the palate.</li>
                <li>For milk drinks, use as base within 20 seconds for optimal flavor.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClassicEspresso


