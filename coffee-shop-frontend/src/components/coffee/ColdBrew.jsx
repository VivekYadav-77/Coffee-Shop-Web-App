import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const ColdBrew = ({ onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  const item = {
    id: 7,
    name: 'Cold Brew',
    description: 'A slow-steeped, naturally sweet coffee served cold with a smooth finish.',
    price: '₹350',
    emoji: '🧊',
    imageUrl: '/Cold brew.png'
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
            <p>Low-acidity extraction highlights sweetness and clarity—refreshing and crisp.</p>
            <div className="coffee-meta">
              <div className="meta-item"><span className="meta-label">Roast</span><span className="meta-value">Light-Medium</span></div>
              <div className="meta-item"><span className="meta-label">Notes</span><span className="meta-value">Caramel, Citrus</span></div>
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
                <li>Steep 12–18 hours in the fridge for balanced extraction.</li>
                <li>Serve over large ice cubes to reduce dilution.</li>
                <li>Try a dash of tonic for a spritzy twist.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ColdBrew



