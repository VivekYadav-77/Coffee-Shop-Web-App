import { useState, useEffect, useRef } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import MenuGrid from './components/MenuGrid'
import Footer from './components/Footer'
import UserAuth from './components/UserAuth'
import EmployeeAuth from './components/EmployeeAuth'
import CartPage from './components/CartPage'
import CheckoutPage from './components/CheckoutPage'
import OrderTrackingPage from './components/OrderTrackingPage'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isMenuVisible, setIsMenuVisible] = useState(false)
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false)
  const [isEmployeeLoggedIn, setIsEmployeeLoggedIn] = useState(false)
  const [pendingDestination, setPendingDestination] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [cartAnimation, setCartAnimation] = useState({ show: false, count: 0 })
  const [orderHistory, setOrderHistory] = useState([])
  const [currentOrder, setCurrentOrder] = useState(null)
  const menuRef = useRef(null)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = JSON.parse(localStorage.getItem('brewCraftUser') || 'null')
    if (savedUser) {
      setIsUserLoggedIn(true)
    }
    
    // Check if employee is logged in
    const savedEmployee = JSON.parse(localStorage.getItem('brewCraftEmployee') || 'null')
    if (savedEmployee) {
      setIsEmployeeLoggedIn(true)
    }

    // Load cart
    const savedCart = JSON.parse(localStorage.getItem('brewCraftCart') || '[]')
    setCartItems(savedCart)

    // Load order history
    const savedOrders = JSON.parse(localStorage.getItem('brewCraftOrders') || '[]')
    setOrderHistory(savedOrders)

    // Load current order if exists
    const savedCurrentOrder = JSON.parse(localStorage.getItem('brewCraftCurrentOrder') || 'null')
    setCurrentOrder(savedCurrentOrder)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brewCraftCart', JSON.stringify(cartItems))
  }, [cartItems])

  // Save order history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('brewCraftOrders', JSON.stringify(orderHistory))
  }, [orderHistory])

  // Save current order to localStorage whenever it changes
  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('brewCraftCurrentOrder', JSON.stringify(currentOrder))
    } else {
      localStorage.removeItem('brewCraftCurrentOrder')
    }
  }, [currentOrder])

  useEffect(() => {
    if (currentPage === 'home') {
      const checkMenuVisibility = () => {
        if (menuRef.current) {
          const rect = menuRef.current.getBoundingClientRect()
          if (rect.top < window.innerHeight + 200) {
            setIsMenuVisible(true)
          }
        }
      }

      const handleScroll = () => {
        checkMenuVisibility()
      }

      window.addEventListener('scroll', handleScroll)
      checkMenuVisibility()

      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage])

  const scrollToMenu = () => {
    if (menuRef.current) {
      menuRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  const handleNavigation = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAuthRequiredAction = (destination) => {
    if (destination === 'cart') {
      // Cart is accessible to everyone
      setCurrentPage('cart')
      return
    }

    if (destination === 'tracking') {
      // Check if user has a current order to track
      if (currentOrder) {
        setCurrentPage('tracking')
        return
      } else {
        alert('No active order to track. Place an order first!')
        return
      }
    }

    if (destination === 'checkout' && !isUserLoggedIn) {
      // Checkout requires authentication
      setPendingDestination(destination)
      setCurrentPage('auth')
      return
    }

    if (isUserLoggedIn) {
      // User is logged in, proceed to destination
      if (destination === 'cart') {
        setCurrentPage('cart')
      } else if (destination === 'checkout') {
        setCurrentPage('checkout')
      } else if (destination === 'tracking') {
        if (currentOrder) {
          setCurrentPage('tracking')
        } else {
          alert('No active order to track. Place an order first!')
        }
      } else {
        alert(`Going to ${destination} page (will be added later)`)
      }
    } else {
      // User not logged in, save destination and show auth
      setPendingDestination(destination)
      setCurrentPage('auth')
    }
  }

  const handleEmployeeAuthRequiredAction = (destination) => {
    if (isEmployeeLoggedIn) {
      // Employee is logged in, proceed to destination
      alert(`Going to ${destination} page (will be added later)`)
    } else {
      // Employee not logged in, show employee auth
      alert('Please sign in as an employee to access this feature')
      setCurrentPage('employeeAuth')
    }
  }

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id)
      
      if (existingItem) {
        // Item exists, increase quantity
        const updatedItems = prevItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
        
        // Trigger cart animation
        const newQuantity = existingItem.quantity + 1
        triggerCartAnimation(newQuantity)
        
        return updatedItems
      } else {
        // New item, add with quantity 1
        const newItem = { ...item, quantity: 1 }
        
        // Trigger cart animation
        triggerCartAnimation(1)
        
        return [...prevItems, newItem]
      }
    })
  }

  const updateCartQuantity = (itemId, change) => {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(item => item.quantity > 0) // Remove items with 0 quantity
    })
  }

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const triggerCartAnimation = (count) => {
    setCartAnimation({ show: true, count })
    setTimeout(() => {
      setCartAnimation({ show: false, count: 0 })
    }, 1500)
  }

  const getCartItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0)
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseInt(item.price.replace('₹', ''))
      return total + (price * item.quantity)
    }, 0)
  }

  const handleUserLogin = (userData) => {
    if (userData.type === 'employee') {
      setIsEmployeeLoggedIn(true)
      localStorage.setItem('brewCraftEmployee', JSON.stringify(userData))
      alert('Employee login successful! Employee dashboard will be added later.')
    } else {
      setIsUserLoggedIn(true)
      localStorage.setItem('brewCraftUser', JSON.stringify(userData))
      
      // If there's a pending destination, go there
      if (pendingDestination) {
        if (pendingDestination === 'cart') {
          setCurrentPage('cart')
        } else if (pendingDestination === 'checkout') {
          setCurrentPage('checkout')
        } else if (pendingDestination === 'tracking') {
          if (currentOrder) {
            setCurrentPage('tracking')
          } else {
            alert('No active order to track.')
          }
        } else {
          alert(`Login successful! Going to ${pendingDestination} page (will be added later)`)
        }
        setPendingDestination(null)
      }
    }
    setCurrentPage('home')
  }

  const handleUserLogout = () => {
    setIsUserLoggedIn(false)
    localStorage.removeItem('brewCraftUser')
    // Keep cart items when logging out
    setCurrentPage('home')
  }

  const handleEmployeeAuth = () => {
    setCurrentPage('employeeAuth')
  }

  const handleOrderComplete = (orderData) => {
    // Add order to history
    setOrderHistory(prev => [orderData, ...prev])
    
    // Set as current order for tracking
    setCurrentOrder(orderData)
    
    // Clear cart
    setCartItems([])
    
    // Show success message and redirect to tracking
    setTimeout(() => {
      alert(`Order ${orderData.orderId} confirmed! Track your order status.`)
      setCurrentPage('tracking')
    }, 2000)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'auth':
        return (
          <UserAuth 
            onLogin={handleUserLogin}
            onCancel={() => {
              setPendingDestination(null)
              setCurrentPage('home')
            }}
          />
        )
      case 'employeeAuth':
        return (
          <EmployeeAuth 
            onLogin={handleUserLogin}
            onCancel={() => setCurrentPage('home')}
          />
        )
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onBackToMenu={() => setCurrentPage('home')}
            onCheckout={() => handleAuthRequiredAction('checkout')}
            isUserLoggedIn={isUserLoggedIn}
            cartTotal={getCartTotal()}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            cartItems={cartItems}
            cartTotal={getCartTotal()}
            onBackToCart={() => setCurrentPage('cart')}
            onOrderComplete={handleOrderComplete}
            isUserLoggedIn={isUserLoggedIn}
          />
        )
      case 'tracking':
        return (
          <OrderTrackingPage
            onBackToHome={() => setCurrentPage('home')}
            orderData={currentOrder}
          />
        )
      case 'home':
      default:
        return (
          <>
            <Hero onExploreClick={scrollToMenu} />
            <div ref={menuRef} style={{height: '1px', position: 'relative'}}></div>
            {isMenuVisible && (
              <MenuGrid 
                onCoffeeClick={handleAuthRequiredAction}
                onAddToCart={addToCart}
                cartItems={cartItems}
                onUpdateQuantity={updateCartQuantity}
              />
            )}
            <Footer 
              onEmployeeAuth={handleEmployeeAuth} 
              onEmployeeAuthRequired={handleEmployeeAuthRequiredAction}
            />
          </>
        )
    }
  }

  return (
    <div className="App">
      <Header 
        onNavigate={handleNavigation}
        isUserLoggedIn={isUserLoggedIn}
        onLogout={handleUserLogout}
        onAuthRequired={handleAuthRequiredAction}
        cartItemCount={getCartItemCount()}
        cartAnimation={cartAnimation}
      />
      {renderPage()}
    </div>
  )
}

export default App