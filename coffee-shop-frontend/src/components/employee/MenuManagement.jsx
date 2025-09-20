import React, { useState, useEffect } from 'react'
import AddCoffeePage from './AddCoffeePage'
import '../../styles/employee/employee-shared.css'

const defaultMenu = []

const MenuManagement = ({ onBack, customMenu, hiddenItems, onUpdateCustomMenu, onUpdateHiddenItems }) => {
  const [showAddCoffee, setShowAddCoffee] = useState(false)
  const [editingCoffee, setEditingCoffee] = useState(null)

  // Default coffee items (the original 9)
  const defaultItems = [
    { id: 1, name: "Classic Espresso" },
    { id: 2, name: "Smooth Americano" },
    { id: 3, name: "Creamy Latte" },
    { id: 4, name: "Frothy Cappuccino" },
    { id: 5, name: "Decadent Mocha" },
    { id: 6, name: "Elegant Macchiato" },
    { id: 7, name: "Cold Brew" },
    { id: 8, name: "Iced Frappé" },
    { id: 9, name: "Flat White" }
  ]

  // Debug function to show current data
  const verifyData = () => {
    console.log('🔍 Current data:')
    console.log('  Custom menu:', customMenu)
    console.log('  Hidden items:', hiddenItems)
  }

  const handleSaveCoffee = (coffeeData) => {
    if (editingCoffee) {
      // Update existing coffee
      const updatedMenu = customMenu.map(item => 
        item.id === editingCoffee.id ? { ...coffeeData, id: editingCoffee.id } : item
      )
      onUpdateCustomMenu(updatedMenu)
      setEditingCoffee(null)
    } else {
      // Add new coffee
      onUpdateCustomMenu([...customMenu, coffeeData])
    }
    setShowAddCoffee(false)
  }

  const handleEditCoffee = (coffee) => {
    setEditingCoffee(coffee)
    setShowAddCoffee(true)
  }

  const removeItem = (id) => {
    onUpdateCustomMenu(customMenu.filter(i => i.id !== id))
  }

  const updatePrice = (id, price) => {
    const updatedMenu = customMenu.map(i => i.id === id ? { ...i, price: `₹${price}` } : i)
    onUpdateCustomMenu(updatedMenu)
  }

  const toggleItemVisibility = (id) => {
    const newHiddenItems = hiddenItems.includes(id) 
      ? hiddenItems.filter(itemId => itemId !== id)
      : [...hiddenItems, id]
    onUpdateHiddenItems(newHiddenItems)
  }

  const isItemHidden = (id) => {
    return hiddenItems.includes(id)
  }

  if (showAddCoffee) {
    return (
      <AddCoffeePage 
        onBack={() => {
          setShowAddCoffee(false)
          setEditingCoffee(null)
        }}
        onSave={handleSaveCoffee}
        editingCoffee={editingCoffee}
      />
    )
  }

  return (
    <div className="emp-page">
      <div className="emp-container">
        <div className="emp-header">
          <button className="back-btn" onClick={onBack}>Back</button>
          <h1 className="emp-title">Menu Management</h1>
          <button 
            onClick={verifyData}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            🔍 Debug
          </button>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button 
            onClick={() => setShowAddCoffee(true)}
            style={{
              background: 'linear-gradient(135deg, #4ade80, #22c55e)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ➕ Add New Coffee
          </button>
        </div>

        {/* Debug Info */}
        <div style={{ 
          background: 'rgba(0,0,0,0.3)', 
          padding: '1rem', 
          borderRadius: '8px', 
          marginBottom: '2rem',
          fontSize: '0.8rem',
          color: 'rgba(255,255,255,0.8)'
        }}>
          <strong>Debug Info:</strong><br/>
          Custom Items: {customMenu.length} | Hidden Items: {hiddenItems.length} | Hidden IDs: [{hiddenItems.join(', ')}]
        </div>

        {/* Original Menu Items Management */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Original Menu Items</h3>
          <div className="emp-list">
            {defaultItems.map(item => (
              <div className="emp-row" key={item.id}>
                <div className="emp-row-main">
                  <strong>{item.name}</strong>
                  <span className="muted">Original menu item</span>
                </div>
                <div className="emp-row-actions">
                  <button 
                    onClick={() => toggleItemVisibility(item.id)}
                    style={{
                      background: isItemHidden(item.id) ? '#ff4757' : '#4ade80',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    {isItemHidden(item.id) ? 'Show in Menu' : 'Hide from Menu'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Menu Items */}
        <div>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Custom Menu Items</h3>
          <div className="emp-list">
            {customMenu.map(item => (
              <div className="emp-row" key={item.id}>
                <div className="emp-row-main">
                  <strong>{item.name}</strong>
                  <span className="muted">{item.description}</span>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
                    {item.roast && `Roast: ${item.roast}`} • {item.notes && `Notes: ${item.notes}`}
                  </div>
                </div>
                <div className="emp-row-actions">
                  <input 
                    style={{width:'100px'}} 
                    type="number" 
                    defaultValue={parseInt(item.price.replace('₹',''))} 
                    onBlur={e => updatePrice(item.id, e.target.value)} 
                  />
                  <button 
                    onClick={() => handleEditCoffee(item)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      marginRight: '0.5rem'
                    }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.4rem 0.8rem',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {customMenu.length === 0 && <div className="muted">No custom items yet. Click "Add New Coffee" to get started!</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuManagement



