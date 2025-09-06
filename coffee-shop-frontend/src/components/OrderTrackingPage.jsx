import React, { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Clock, Phone, User, Package, Truck, CheckCircle, Coffee, Navigation } from 'lucide-react'

const OrderTrackingPage = ({ onBackToHome, orderData }) => {
  const [currentStatus, setCurrentStatus] = useState(0)
  const [deliveryPerson, setDeliveryPerson] = useState(null)
  const [estimatedTime, setEstimatedTime] = useState(45) // minutes
  const [liveLocation, setLiveLocation] = useState({ lat: 26.8467, lng: 80.9462 }) // Lucknow coordinates

  const orderStatuses = [
    {
      id: 0,
      title: "Order Placed",
      description: "Your order has been received and confirmed",
      icon: Package,
      time: "2 mins ago",
      completed: true
    },
    {
      id: 1,
      title: "Being Prepared",
      description: "Our baristas are crafting your perfect coffee",
      icon: Coffee,
      time: "Now",
      completed: false
    },
    {
      id: 2,
      title: "Order Packed",
      description: "Your order is ready and being packed for delivery",
      icon: Package,
      time: "In 8 mins",
      completed: false
    },
    {
      id: 3,
      title: "Out for Delivery",
      description: "Your order is on the way to your location",
      icon: Truck,
      time: "In 25 mins",
      completed: false
    },
    {
      id: 4,
      title: "Delivered",
      description: "Enjoy your delicious coffee!",
      icon: CheckCircle,
      time: "In 45 mins",
      completed: false
    }
  ]

  // Demo delivery persons
  const deliveryPersons = [
    { name: "Rahul Kumar", phone: "+91 98765 43210", vehicle: "Bike - UP 32 AB 1234", rating: 4.8, trips: 1247 },
    { name: "Amit Singh", phone: "+91 87654 32109", vehicle: "Scooter - UP 32 CD 5678", rating: 4.9, trips: 892 },
    { name: "Priya Sharma", phone: "+91 76543 21098", vehicle: "Bike - UP 32 EF 9012", rating: 4.7, trips: 1156 }
  ]

  useEffect(() => {
    // Simulate order progress
    const progressTimer = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev < 4) {
          const newStatus = prev + 1
          
          // Assign delivery person when out for delivery
          if (newStatus === 3) {
            const randomPerson = deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)]
            setDeliveryPerson(randomPerson)
          }
          
          return newStatus
        }
        clearInterval(progressTimer)
        return prev
      })
    }, 15000) // Update every 15 seconds for demo

    // Simulate estimated time countdown
    const timeTimer = setInterval(() => {
      setEstimatedTime(prev => {
        if (prev > 0) {
          return prev - 1
        }
        clearInterval(timeTimer)
        return 0
      })
    }, 60000) // Update every minute

    // Simulate live location updates (for demo)
    const locationTimer = setInterval(() => {
      if (currentStatus >= 3) { // Only when out for delivery
        setLiveLocation(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.lng + (Math.random() - 0.5) * 0.001
        }))
      }
    }, 5000) // Update every 5 seconds

    // Set initial delivery person randomly
    setTimeout(() => {
      const randomPerson = deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)]
      setDeliveryPerson(randomPerson)
    }, 2000)

    return () => {
      clearInterval(progressTimer)
      clearInterval(timeTimer)
      clearInterval(locationTimer)
    }
  }, [currentStatus])

  const getStatusTime = (statusId) => {
    if (statusId <= currentStatus) {
      const minutesAgo = (currentStatus - statusId) * 8
      if (minutesAgo === 0) return "Just now"
      return `${minutesAgo} mins ago`
    }
    const minutesFromNow = (statusId - currentStatus) * 8
    return `In ${minutesFromNow} mins`
  }

  const getMapEmbedUrl = () => {
    // BBD University coordinates in Lucknow (origin point)
    const bbdUniversityLat = 26.8560
    const bbdUniversityLng = 80.9760
    
    // Customer delivery location (destination)
    const customerLat = 26.8467
    const customerLng = 80.9462
    
    // Google Maps embed URL with route from BBD University to customer location
    return `https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d14276.416364889856!2d${bbdUniversityLng}!3d${bbdUniversityLat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x399be30fb4c94c2d%3A0x1f6b1c0e8b5c7a9!2sbabu%20banarasi%20das%20university%20lucknow!3m2!1d${bbdUniversityLat}!2d${bbdUniversityLng}!4m5!1s0x399be37eb0826741%3A0x34d9dd79cdeac7d8!2sLucknow%2C%20Uttar%20Pradesh!3m2!1d${customerLat}!2d${customerLng}!5e0!3m2!1sen!2sin!4v1635789012345!5m2!1sen!2sin`
  }

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        <div className="tracking-header">
          <button className="back-btn" onClick={onBackToHome}>
            <ArrowLeft size={20} />
          </button>
          <div className="tracking-title-section">
            <h1 className="tracking-title">Track Your Order</h1>
            <div className="order-id">Order #{orderData?.orderId || 'BC123456'}</div>
          </div>
        </div>

        <div className="tracking-content">
          {/* Order Status Timeline */}
          <div className="tracking-timeline">
            <div className="timeline-header">
              <h2>Order Progress</h2>
              <div className="estimated-time">
                <Clock size={20} />
                <span>
                  {estimatedTime > 0 
                    ? `Estimated delivery: ${estimatedTime} mins`
                    : 'Delivered!'
                  }
                </span>
              </div>
            </div>

            <div className="timeline">
              {orderStatuses.map((status, index) => (
                <div 
                  key={status.id} 
                  className={`timeline-item ${index <= currentStatus ? 'completed' : 'pending'} ${index === currentStatus ? 'current' : ''}`}
                >
                  <div className="timeline-icon">
                    <status.icon size={24} />
                  </div>
                  <div className="timeline-content">
                    <h3>{status.title}</h3>
                    <p>{status.description}</p>
                    <span className="timeline-time">{getStatusTime(index)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Map Section */}
          <div className="tracking-map-section">
            <div className="map-header">
              <h2>
                <MapPin size={24} />
                Live Delivery Tracking
              </h2>
              {currentStatus >= 3 && (
                <div className="live-indicator">
                  <div className="live-dot"></div>
                  <span>Live</span>
                </div>
              )}
            </div>

            <div className="delivery-map">
              <iframe
                src={getMapEmbedUrl()}
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Delivery Route from BBD University"
              ></iframe>
              
              {currentStatus >= 3 && (
                <div className="map-overlay">
                  <div className="delivery-location">
                    <div className="location-pulse"></div>
                    <Navigation size={16} />
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Person Card */}
            {deliveryPerson && currentStatus >= 3 && (
              <div className="delivery-person-card">
                <div className="delivery-person-header">
                  <h3>Your Delivery Partner</h3>
                  <div className="delivery-status">
                    <div className="status-dot"></div>
                    <span>On the way</span>
                  </div>
                </div>
                
                <div className="delivery-person-info">
                  <div className="person-avatar">
                    <User size={32} />
                  </div>
                  <div className="person-details">
                    <h4>{deliveryPerson.name}</h4>
                    <p>{deliveryPerson.vehicle}</p>
                    <div className="person-stats">
                      <span>⭐ {deliveryPerson.rating}</span>
                      <span>•</span>
                      <span>{deliveryPerson.trips.toLocaleString()} deliveries</span>
                    </div>
                  </div>
                  <button className="contact-btn">
                    <Phone size={18} />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Card */}
        <div className="order-details-card">
          <h3>Order Details</h3>
          <div className="order-items-list">
            {(orderData?.items || []).map(item => (
              <div key={item.id} className="order-item-row">
                <span className="item-emoji">{item.emoji}</span>
                <div className="item-info">
                  <span className="item-name">{item.name}</span>
                  <span className="item-quantity">× {item.quantity}</span>
                </div>
                <span className="item-total">₹{(parseInt(item.price.replace('₹', '')) * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          
          <div className="order-total-section">
            <div className="total-row">
              <span>Subtotal</span>
              <span>₹{(orderData?.total - 50 - Math.round((orderData?.total - 50) * 0.05) || 0).toLocaleString()}</span>
            </div>
            <div className="total-row">
              <span>Delivery Fee</span>
              <span>{orderData?.total > 0 ? '₹50' : 'Free'}</span>
            </div>
            <div className="total-row">
              <span>Tax (5%)</span>
              <span>₹{Math.round((orderData?.total - 50) * 0.05 || 0).toLocaleString()}</span>
            </div>
            <div className="total-divider"></div>
            <div className="total-row final">
              <span>Total Paid</span>
              <span>₹{(orderData?.total || 0).toLocaleString()}</span>
            </div>
          </div>

          <div className="delivery-address">
            <h4>
              <MapPin size={18} />
              Delivery Address
            </h4>
            <p>
              {orderData?.customerInfo?.address || "123 Demo Street"}, <br/>
              {orderData?.customerInfo?.city || "Lucknow"}, {orderData?.customerInfo?.state || "Uttar Pradesh"} - {orderData?.customerInfo?.pincode || "226001"}
              {orderData?.customerInfo?.landmark && (
                <><br/><small>Near: {orderData.customerInfo.landmark}</small></>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage