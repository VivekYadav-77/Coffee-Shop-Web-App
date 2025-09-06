import React, { useState } from 'react'
import { ArrowLeft, CreditCard, Smartphone, Building, MapPin, User, Mail, Phone, Calendar, Lock, CheckCircle, AlertCircle } from 'lucide-react'

const CheckoutPage = ({ 
  cartItems, 
  cartTotal, 
  onBackToCart, 
  onOrderComplete,
  isUserLoggedIn 
}) => {
  const [step, setStep] = useState(1) // 1: Details, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    // Contact Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Delivery Address
    address: '',
    city: '',
    state: 'Uttar Pradesh',
    pincode: '',
    landmark: '',
    
    // Payment Info
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // UPI Info
    upiId: '',
    
    // Order Notes
    orderNotes: ''
  })
  const [errors, setErrors] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)

  const deliveryFee = cartTotal > 0 ? 50 : 0
  const tax = cartTotal > 0 ? Math.round(cartTotal * 0.05) : 0
  const finalTotal = cartTotal + deliveryFee + tax

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number'
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.pincode.trim()) {
      newErrors.pincode = 'PIN code is required'
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit PIN code'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) {
        newErrors.cardNumber = 'Card number is required'
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s+/g, ''))) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number'
      }
      
      if (!formData.expiryDate.trim()) {
        newErrors.expiryDate = 'Expiry date is required'
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Please enter date in MM/YY format'
      }
      
      if (!formData.cvv.trim()) {
        newErrors.cvv = 'CVV is required'
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = 'Please enter a valid CVV'
      }
      
      if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId.trim()) {
        newErrors.upiId = 'UPI ID is required'
      } else if (!/^[\w.-]+@[\w.-]+$/.test(formData.upiId)) {
        newErrors.upiId = 'Please enter a valid UPI ID'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      setStep(3)
      processOrder()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      onBackToCart()
    }
  }

  const processOrder = () => {
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      // Generate order ID
      const orderId = `BC${Date.now().toString().slice(-6)}`
      
      // Simulate successful order
      const orderData = {
        orderId,
        items: cartItems,
        total: finalTotal,
        customerInfo: formData,
        orderTime: new Date(),
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000), // 45 minutes from now
        status: 'confirmed'
      }
      
      onOrderComplete(orderData)
    }, 3000)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value)
    if (formatted.length <= 19) { // 16 digits + 3 spaces
      setFormData(prev => ({ ...prev, cardNumber: formatted }))
    }
  }

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleExpiryChange = (e) => {
    const formatted = formatExpiryDate(e.target.value)
    setFormData(prev => ({ ...prev, expiryDate: formatted }))
  }

  if (step === 3) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-header">
            <h1 className="checkout-title">Order Processing</h1>
          </div>

          <div className="confirmation-content">
            {isProcessing ? (
              <div className="processing-section">
                <div className="processing-spinner">
                  <div className="spinner"></div>
                </div>
                <h2>Processing Your Order...</h2>
                <p>Please wait while we confirm your payment and prepare your order.</p>
                <div className="processing-steps">
                  <div className="processing-step active">
                    <CheckCircle size={20} />
                    <span>Order details verified</span>
                  </div>
                  <div className="processing-step active">
                    <CheckCircle size={20} />
                    <span>Payment processing</span>
                  </div>
                  <div className="processing-step">
                    <div className="step-pending"></div>
                    <span>Confirming with kitchen</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="success-section">
                <div className="success-icon">
                  <CheckCircle size={80} />
                </div>
                <h2>Order Confirmed!</h2>
                <p>Your delicious coffee is being prepared with love.</p>
                
                <div className="order-summary-final">
                  <h3>Order Details</h3>
                  <div className="order-items-final">
                    {cartItems.map(item => (
                      <div key={item.id} className="order-item-final">
                        <span>{item.emoji} {item.name} × {item.quantity}</span>
                        <span>₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-total-final">
                    <strong>Total Paid: ₹{finalTotal.toLocaleString()}</strong>
                  </div>
                </div>

                <button 
                  className="home-btn"
                  onClick={() => onOrderComplete({
                    orderId: `BC${Date.now().toString().slice(-6)}`,
                    items: cartItems,
                    total: finalTotal,
                    customerInfo: formData,
                    orderTime: new Date(),
                    estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
                    status: 'confirmed'
                  })}
                >
                  Track Your Order
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <button className="back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
          </button>
          <h1 className="checkout-title">Checkout</h1>
          <div className="step-indicator">
            <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-form">
            {step === 1 && (
              <div className="checkout-step">
                <h2 className="step-title">
                  <User size={24} />
                  Delivery Information
                </h2>
                
                <div className="form-section">
                  <h3>Contact Details</h3>
                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="firstName">First Name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? 'error' : ''}
                        placeholder="Akshat"
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="lastName">Last Name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? 'error' : ''}
                        placeholder="Tiwari"
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>
                  
                  <div className="input-group">
                    <label htmlFor="email">
                      <Mail size={16} />
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="Akshat@email.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="phone">
                      <Phone size={16} />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                      placeholder="9876543210"
                    />
                    {errors.phone && <span className="error-text">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <MapPin size={20} />
                    Delivery Address
                  </h3>
                  
                  <div className="input-group">
                    <label htmlFor="address">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? 'error' : ''}
                      placeholder="123 Main Street, Apartment 4B"
                    />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="input-group">
                      <label htmlFor="city">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={errors.city ? 'error' : ''}
                        placeholder="Lucknow"
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                    <div className="input-group">
                      <label htmlFor="pincode">PIN Code</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className={errors.pincode ? 'error' : ''}
                        placeholder="226001"
                      />
                      {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="landmark">Landmark (Optional)</label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleInputChange}
                      placeholder="Near City Mall, Opposite Park"
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3>Order Notes (Optional)</h3>
                  <div className="input-group">
                    <textarea
                      id="orderNotes"
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleInputChange}
                      placeholder="Any special instructions for your order..."
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-step">
                <h2 className="step-title">
                  <CreditCard size={24} />
                  Payment Information
                </h2>

                <div className="payment-methods">
                  <h3>Choose Payment Method</h3>
                  <div className="payment-options">
                    <div 
                      className={`payment-option ${formData.paymentMethod === 'card' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'card' }))}
                    >
                      <CreditCard size={24} />
                      <span>Credit/Debit Card</span>
                    </div>
                    <div 
                      className={`payment-option ${formData.paymentMethod === 'upi' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'upi' }))}
                    >
                      <Smartphone size={24} />
                      <span>UPI Payment</span>
                    </div>
                    <div 
                      className={`payment-option ${formData.paymentMethod === 'cod' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                    >
                      <Building size={24} />
                      <span>Cash on Delivery</span>
                    </div>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="form-section">
                    <h3>Card Details</h3>
                    <div className="demo-cards">
                      <small style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', display: 'block' }}>
                        <strong>Demo Cards:</strong> 4532 1234 5678 9012 | Expiry: 12/28 | CVV: 123
                      </small>
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="cardNumber">
                        <CreditCard size={16} />
                        Card Number
                      </label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleCardNumberChange}
                        className={errors.cardNumber ? 'error' : ''}
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                      {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                    </div>

                    <div className="form-row">
                      <div className="input-group">
                        <label htmlFor="expiryDate">
                          <Calendar size={16} />
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleExpiryChange}
                          className={errors.expiryDate ? 'error' : ''}
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                        {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="cvv">
                          <Lock size={16} />
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className={errors.cvv ? 'error' : ''}
                          placeholder="123"
                          maxLength="4"
                        />
                        {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                      </div>
                    </div>

                    <div className="input-group">
                      <label htmlFor="cardName">Cardholder Name</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className={errors.cardName ? 'error' : ''}
                        placeholder="Akshat Tiwari"
                      />
                      {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'upi' && (
                  <div className="form-section">
                    <h3>UPI Payment</h3>
                    <div className="demo-upi">
                      <small style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '1rem', display: 'block' }}>
                        <strong>Demo UPI:</strong> demo@paytm | demo@gpay | test@phonepe
                      </small>
                    </div>
                    
                    <div className="input-group">
                      <label htmlFor="upiId">
                        <Smartphone size={16} />
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleInputChange}
                        className={errors.upiId ? 'error' : ''}
                        placeholder="yourname@paytm"
                      />
                      {errors.upiId && <span className="error-text">{errors.upiId}</span>}
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'cod' && (
                  <div className="form-section">
                    <div className="cod-info">
                      <AlertCircle size={24} className="cod-icon" />
                      <div className="cod-text">
                        <h3>Cash on Delivery</h3>
                        <p>You can pay in cash when your order arrives. Please keep exact change ready.</p>
                        <div className="cod-amount">Amount to pay: ₹{finalTotal.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="checkout-summary">
            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <span className="item-emoji">{item.emoji}</span>
                      <div className="item-details">
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div className="item-price">
                      ₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-calculations">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `₹${deliveryFee}` : 'Free'}</span>
                </div>
                <div className="summary-row">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toLocaleString()}</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row total">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {step === 1 && (
                <button className="checkout-next-btn" onClick={handleNext}>
                  Continue to Payment
                  <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}

              {step === 2 && (
                <button className="checkout-next-btn" onClick={handleNext}>
                  {formData.paymentMethod === 'cod' ? 'Place Order' : 'Pay Now'}
                  <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage