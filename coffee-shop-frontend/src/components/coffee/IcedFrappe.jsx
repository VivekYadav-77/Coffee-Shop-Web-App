import React from 'react'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import '../../styles/coffee/detail-shared.css'

const IcedFrappe = ({ onBack, onAddToCart, onUpdateQuantity, currentQuantity }) => {
  const item = {
    id: 8,
    name: 'Iced Frappe',
    description: 'A blended coffee drink with ice, milk, and sweetener, topped with whipped cream.',
    price: '₹320',
    emoji: '🥤',
    imageUrl: '/Iced Frappe.png'
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
            <p>
              A refreshing blended coffee drink perfect for hot days. Made with premium coffee, ice, milk, and a touch of sweetness, then topped with whipped cream for the ultimate indulgence.
            </p>

            <div className="coffee-meta">
              <div className="meta-item">
                <span className="meta-label">Taste Profile</span>
                <span className="meta-value">Sweet, Creamy, Refreshing</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Temperature</span>
                <span className="meta-value">Iced</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Size</span>
                <span className="meta-value">Large (500ml)</span>
              </div>
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
              <p>Perfect for hot summer days! Best enjoyed immediately after preparation to maintain the ideal temperature and texture. The whipped cream adds a luxurious finish to this refreshing treat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IcedFrappe