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
import ClassicEspresso from './components/coffee/ClassicEspresso'
import SmoothAmericano from './components/coffee/SmoothAmericano'
import CreamyLatte from './components/coffee/CreamyLatte'
import FrothyCappuccino from './components/coffee/FrothyCappuccino'
import DecadentMocha from './components/coffee/DecadentMocha'
import ElegantMacchiato from './components/coffee/ElegantMacchiato'
import ColdBrew from './components/coffee/ColdBrew'
import IcedFrappe from './components/coffee/IcedFrappe'
import FlatWhite from './components/coffee/FlatWhite'
import MenuManagement from './components/employee/MenuManagement'
import OrderManagement from './components/employee/OrderManagement'
import AnalyticsPage from './components/employee/Analytics'
import TeamPage from './components/TeamPage'
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

    // Handle coffee detail pages (no auth required)
    if (destination && destination.startsWith('coffee-')) {
      setCurrentPage(destination)
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
      } else if (destination) {
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
      setCurrentPage(destination)
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
        const newQty = Math.min(10, existingItem.quantity + 1)
        if (newQty === existingItem.quantity) {
          alert('Maximum 10 items allowed per coffee.')
          return prevItems
        }
        const updatedItems = prevItems.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: newQty }
            : cartItem
        )
        triggerCartAnimation(newQty)
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
          const newQuantity = Math.max(0, Math.min(10, item.quantity + change))
          if (item.quantity === 10 && change > 0) {
            alert('Maximum 10 items allowed per coffee.')
          }
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
      // clear any user session when logging in as employee
      setIsUserLoggedIn(false)
      localStorage.removeItem('brewCraftUser')
    } else {
      setIsUserLoggedIn(true)
      localStorage.setItem('brewCraftUser', JSON.stringify(userData))
      // clear any employee session when logging in as user
      setIsEmployeeLoggedIn(false)
      localStorage.removeItem('brewCraftEmployee')
      
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
        }
        setPendingDestination(null)
      }
    }
    setCurrentPage('home')
  }

  const handleUserLogout = () => {
    setIsUserLoggedIn(false)
    setIsEmployeeLoggedIn(false)
    localStorage.removeItem('brewCraftUser')
    localStorage.removeItem('brewCraftEmployee')
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
      case 'coffee-classic-espresso': {
        const existing = cartItems.find(ci => ci.id === 1)
        const qty = existing ? existing.quantity : 0
        return (
          <ClassicEspresso
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-smooth-americano': {
        const existing = cartItems.find(ci => ci.id === 2)
        const qty = existing ? existing.quantity : 0
        return (
          <SmoothAmericano
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-creamy-latte': {
        const existing = cartItems.find(ci => ci.id === 3)
        const qty = existing ? existing.quantity : 0
        return (
          <CreamyLatte
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-frothy-cappuccino': {
        const existing = cartItems.find(ci => ci.id === 4)
        const qty = existing ? existing.quantity : 0
        return (
          <FrothyCappuccino
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-decadent-mocha': {
        const existing = cartItems.find(ci => ci.id === 5)
        const qty = existing ? existing.quantity : 0
        return (
          <DecadentMocha
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-elegant-macchiato': {
        const existing = cartItems.find(ci => ci.id === 6)
        const qty = existing ? existing.quantity : 0
        return (
          <ElegantMacchiato
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-cold-brew': {
        const existing = cartItems.find(ci => ci.id === 7)
        const qty = existing ? existing.quantity : 0
        return (
          <ColdBrew
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-iced-frappé': {
        const existing = cartItems.find(ci => ci.id === 8)
        const qty = existing ? existing.quantity : 0
        return (
          <IcedFrappe
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
      case 'coffee-flat-white': {
        const existing = cartItems.find(ci => ci.id === 9)
        const qty = existing ? existing.quantity : 0
        return (
          <FlatWhite
            onBack={() => setCurrentPage('home')}
            onAddToCart={addToCart}
            onUpdateQuantity={updateCartQuantity}
            currentQuantity={qty}
          />
        )
      }
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
          <UserAuth 
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
      case 'menu-management':
        return (
          <MenuManagement onBack={() => setCurrentPage('home')} />
        )
      case 'order-management':
        return (
          <OrderManagement onBack={() => setCurrentPage('home')} />
        )
      case 'analytics':
        return (
          <AnalyticsPage onBack={() => setCurrentPage('home')} />
        )
      case 'team':
        return (
          <TeamPage onBack={() => setCurrentPage('home')} />
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
              isEmployeeLoggedIn={isEmployeeLoggedIn}
              onNavigate={handleNavigation}
            />
          </>
        )
    }
  }

  return (
    <div className="App">
      <Header 
        onNavigate={handleNavigation}
        isUserLoggedIn={isUserLoggedIn || isEmployeeLoggedIn}
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