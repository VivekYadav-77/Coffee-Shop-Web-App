import React from 'react'
import { UserCheck } from 'lucide-react'

const Footer = ({ onEmployeeAuth, onEmployeeAuthRequired }) => {
  const handleLinkClick = (e, pageName) => {
    e.preventDefault()
    alert(`${pageName} page will be added soon!`)
  }

  const handleEmployeeDashboardClick = (e) => {
    e.preventDefault()
    onEmployeeAuthRequired('employee-dashboard')
  }

  const handleMenuManagementClick = (e) => {
    e.preventDefault()
    onEmployeeAuthRequired('menu-management')
  }

  const handleOrderManagementClick = (e) => {
    e.preventDefault()
    onEmployeeAuthRequired('order-management')
  }

  const handleAnalyticsClick = (e) => {
    e.preventDefault()
    onEmployeeAuthRequired('analytics')
  }

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Us</h3>
          <ul>
            <li>
              <a 
                href="#learn-team" 
                onClick={(e) => handleLinkClick(e, 'Learn about the team')}
              >
                Learn about the team
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => handleLinkClick(e, 'Contact us')}
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>For Employees</h3>
          <ul>
            <li>
              <a 
                href="#dashboard" 
                onClick={handleEmployeeDashboardClick}
              >
                Dashboard
              </a>
            </li>
            <li>
              <a 
                href="#menu-management" 
                onClick={handleMenuManagementClick}
              >
                Menu management
              </a>
            </li>
            <li>
              <a 
                href="#order-management" 
                onClick={handleOrderManagementClick}
              >
                Order management
              </a>
            </li>
            <li>
              <a 
                href="#analytics" 
                onClick={handleAnalyticsClick}
              >
                Analytics
              </a>
            </li>
          </ul>
          
          {/* Employee Auth Button */}
          <div className="business-auth-section">
            <button 
              className="business-auth-btn" 
              onClick={onEmployeeAuth}
            >
              <UserCheck size={18} />
              <span>Employee Login</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 BREW CRAFT Coffee. All rights reserved. Crafted with ❤️ for coffee lovers worldwide.</p>
      </div>
    </footer>
  )
}

export default Footer