import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const CustomCoffee = ({ coffeeData, onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  if (!coffeeData) {
    return (
      <div className="coffee-detail-page">
        <div className="coffee-detail-container">
          <div className="coffee-detail-header">
            <button className="back-btn" onClick={onBack}>
              <ArrowLeft size={20} />
            </button>
            <h1 className="coffee-detail-title">Coffee Not Found</h1>
          </div>
          <p>This coffee item could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="coffee-detail-page">
      <div className="coffee-detail-container">
        <div className="coffee-detail-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="coffee-detail-title">{coffeeData.name}</h1>
        </div>

        <div className="coffee-detail-content">
          <div className="coffee-visual">
            <div className="coffee-image-frame">
              <img 
                className="coffee-image-placeholder" 
                src={coffeeData.imageUrl || '/espresso.png'} 
                alt={`${coffeeData.name} image`}
                loading="lazy"
                decoding="async"
                width="520"
                height="520"
              />
            </div>
          </div>

          <div className="coffee-info-card">
            <h2>About this coffee</h2>
            <p>{coffeeData.about || coffeeData.description || 'A delicious coffee crafted with care.'}</p>

            <div className="coffee-meta">
              {coffeeData.roast && (
                <div className="meta-item">
                  <span className="meta-label">Roast</span>
                  <span className="meta-value">{coffeeData.roast}</span>
                </div>
              )}
              {coffeeData.notes && (
                <div className="meta-item">
                  <span className="meta-label">Notes</span>
                  <span className="meta-value">{coffeeData.notes}</span>
                </div>
              )}
              {coffeeData.size && (
                <div className="meta-item">
                  <span className="meta-label">Size</span>
                  <span className="meta-value">{coffeeData.size}</span>
                </div>
              )}
              {coffeeData.amount && (
                <div className="meta-item">
                  <span className="meta-label">Amount</span>
                  <span className="meta-value">{coffeeData.amount}</span>
                </div>
              )}
            </div>

            <div className="coffee-purchase">
              <div className="coffee-price">{coffeeData.price}</div>

              {currentQuantity > 0 ? (
                <div className="quantity-controls">
                  <button className="quantity-btn minus" onClick={() => onUpdateQuantity(coffeeData.id, -1)}>
                    <Minus size={16} />
                  </button>
                  <span className="quantity-display">{currentQuantity}</span>
                  <button className="quantity-btn plus" onClick={() => onUpdateQuantity(coffeeData.id, 1)}>
                    <Plus size={16} />
                  </button>
                </div>
              ) : (
                <button className="order-now-btn" onClick={() => onAddToCart(coffeeData)}>
                  <span>Add to Cart</span>
                </button>
              )}
            </div>

            {coffeeData.baristaTips && (
              <div className="brew-tips">
                <h3>Barista Tips</h3>
                <ul>
                  <li>{coffeeData.baristaTips}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomCoffee
