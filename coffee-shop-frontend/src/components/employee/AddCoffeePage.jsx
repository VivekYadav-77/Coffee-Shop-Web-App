import React, { useState, useEffect } from 'react'
import { ArrowLeft, Upload, X } from 'lucide-react'
import '../../styles/employee/employee-shared.css'

const AddCoffeePage = ({ onBack, onSave, editingCoffee }) => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    about: '',
    roast: '',
    notes: '',
    size: '',
    amount: '',
    baristaTips: '',
    imageUrl: '',
    emoji: '☕'
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editingCoffee) {
      setForm({
        name: editingCoffee.name || '',
        price: editingCoffee.price ? editingCoffee.price.replace('₹', '') : '',
        description: editingCoffee.description || '',
        about: editingCoffee.about || '',
        roast: editingCoffee.roast || '',
        notes: editingCoffee.notes || '',
        size: editingCoffee.size || '',
        amount: editingCoffee.amount || '',
        baristaTips: editingCoffee.baristaTips || '',
        imageUrl: editingCoffee.imageUrl || '',
        emoji: editingCoffee.emoji || '☕'
      })
      if (editingCoffee.imageUrl) {
        setImagePreview(editingCoffee.imageUrl)
      }
    }
  }, [editingCoffee])

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target.result)
        setForm(prev => ({ ...prev, imageUrl: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview('')
    setForm(prev => ({ ...prev, imageUrl: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.name.trim()) newErrors.name = 'Coffee name is required'
    if (!form.price || form.price <= 0) newErrors.price = 'Valid price is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.about.trim()) newErrors.about = 'About this coffee is required'
    if (!form.roast.trim()) newErrors.roast = 'Roast level is required'
    if (!form.notes.trim()) newErrors.notes = 'Tasting notes are required'
    if (!form.size.trim()) newErrors.size = 'Size information is required'
    if (!form.amount.trim()) newErrors.amount = 'Amount is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const coffeeData = {
      id: Date.now(),
      name: form.name.trim(),
      price: `₹${form.price}`,
      description: form.description.trim(),
      about: form.about.trim(),
      roast: form.roast.trim(),
      notes: form.notes.trim(),
      size: form.size.trim(),
      amount: form.amount.trim(),
      baristaTips: form.baristaTips.trim(),
      imageUrl: form.imageUrl || '/espresso.png',
      emoji: form.emoji,
      isCustom: true
    }

    onSave(coffeeData)
  }

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="emp-page">
      <div className="emp-container">
        <div className="emp-header">
          <button className="back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
            Back to Menu Management
          </button>
          <h1 className="emp-title">{editingCoffee ? 'Edit Coffee' : 'Add New Coffee'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="emp-form" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Basic Information */}
          <div>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Basic Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input 
                  placeholder="Coffee Name *" 
                  value={form.name} 
                  onChange={e => handleInputChange('name', e.target.value)}
                  style={{ borderColor: errors.name ? '#ff4757' : '' }}
                />
                {errors.name && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.name}</div>}
              </div>
              <div>
                <input 
                  placeholder="Price (₹) *" 
                  type="number" 
                  value={form.price} 
                  onChange={e => handleInputChange('price', e.target.value)}
                  style={{ borderColor: errors.price ? '#ff4757' : '' }}
                />
                {errors.price && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.price}</div>}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input 
                  placeholder="Image URL (public path)" 
                  value={form.imageUrl} 
                  onChange={e => handleInputChange('imageUrl', e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label style={{ color: 'white', fontSize: '0.9rem' }}>Emoji:</label>
                <input 
                  placeholder="☕" 
                  value={form.emoji} 
                  onChange={e => handleInputChange('emoji', e.target.value)}
                  style={{ width: '60px', textAlign: 'center' }}
                />
              </div>
            </div>

            <label style={{
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '0.6rem 1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
              marginBottom: '1rem'
            }}>
              <Upload size={16} />
              Upload Image
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={{ display: 'none' }}
              />
            </label>

            {imagePreview && (
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.2)' 
                  }} 
                />
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#ff4757',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Descriptions</h3>
            <div style={{ marginBottom: '1rem' }}>
              <textarea 
                placeholder="Short Description (for menu card) *" 
                value={form.description} 
                onChange={e => handleInputChange('description', e.target.value)}
                rows="2"
                style={{ 
                  borderColor: errors.description ? '#ff4757' : '',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  color: '#fff',
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {errors.description && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.description}</div>}
            </div>
            
            <div>
              <textarea 
                placeholder="About This Coffee (detailed description) *" 
                value={form.about} 
                onChange={e => handleInputChange('about', e.target.value)}
                rows="3"
                style={{ 
                  borderColor: errors.about ? '#ff4757' : '',
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  color: '#fff',
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
              {errors.about && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.about}</div>}
            </div>
          </div>

          {/* Coffee Details */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.2rem' }}>Coffee Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input 
                  placeholder="Roast Level *" 
                  value={form.roast} 
                  onChange={e => handleInputChange('roast', e.target.value)}
                  style={{ borderColor: errors.roast ? '#ff4757' : '' }}
                />
                {errors.roast && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.roast}</div>}
              </div>
              <div>
                <input 
                  placeholder="Tasting Notes *" 
                  value={form.notes} 
                  onChange={e => handleInputChange('notes', e.target.value)}
                  style={{ borderColor: errors.notes ? '#ff4757' : '' }}
                />
                {errors.notes && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.notes}</div>}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <input 
                  placeholder="Size *" 
                  value={form.size} 
                  onChange={e => handleInputChange('size', e.target.value)}
                  style={{ borderColor: errors.size ? '#ff4757' : '' }}
                />
                {errors.size && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.size}</div>}
              </div>
              <div>
                <input 
                  placeholder="Amount *" 
                  value={form.amount} 
                  onChange={e => handleInputChange('amount', e.target.value)}
                  style={{ borderColor: errors.amount ? '#ff4757' : '' }}
                />
                {errors.amount && <div style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem' }}>{errors.amount}</div>}
              </div>
            </div>
            
            <div>
              <textarea 
                placeholder="Barista Tips (optional)" 
                value={form.baristaTips} 
                onChange={e => handleInputChange('baristaTips', e.target.value)}
                rows="2"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '10px',
                  padding: '0.6rem 0.8rem',
                  color: '#fff',
                  width: '100%',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1rem' }}>
            <button 
              type="button" 
              onClick={onBack}
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '0.8rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {editingCoffee ? 'Update Coffee' : 'Add Coffee to Menu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddCoffeePage
