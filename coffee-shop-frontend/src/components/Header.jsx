import React, { useState, useEffect } from 'react'
import { Coffee, ShoppingCart, Package, Truck, User, LogOut } from 'lucide-react'

const Header = ({ onNavigate, isUserLoggedIn, onLogout, onAuthRequired, cartItemCount, cartAnimation }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = (e, action, page) => {
    e.preventDefault()
    setIsMenuOpen(false)
    
    if (action === 'navigate') {
      onNavigate(page)
    } else if (action === 'auth-required') {
      onAuthRequired(page)
    } else if (action === 'logout') {
      onLogout()
    }
  }

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <a 
          href="#home" 
          className="logo" 
          onClick={(e) => handleNavClick(e, 'navigate', 'home')}
        >
          <Coffee size={36} className="logo-icon" />
          <span>BREW CRAFT</span>
        </a>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <a 
            href="#home" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'navigate', 'home')}
          >
            <span>Home</span>
          </a>
          
          <a 
            href="#cart" 
            className="nav-link cart-nav-link"
            onClick={(e) => handleNavClick(e, 'auth-required', 'cart')}
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
              {cartAnimation.show && (
                <span className="cart-animation">+{cartAnimation.count}</span>
              )}
            </div>
            <span>Cart</span>
          </a>
          
          <a 
            href="#checkout" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'auth-required', 'checkout')}
          >
            <Package size={20} />
            <span>Checkout</span>
          </a>
          
          <a 
            href="#tracking" 
            className="nav-link"
            onClick={(e) => handleNavClick(e, 'auth-required', 'tracking')}
          >
            <Truck size={20} />
            <span>Track Order</span>
          </a>
          
          {isUserLoggedIn ? (
            <a 
              href="#logout" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'logout')}
            >
              <LogOut size={20} />
              <span>Logout</span>
            </a>
          ) : (
            <a 
              href="#signin" 
              className="nav-link"
              onClick={(e) => handleNavClick(e, 'navigate', 'auth')}
            >
              <User size={20} />
              <span>Sign In</span>
            </a>
          )}
        </nav>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  )
}

export default Header