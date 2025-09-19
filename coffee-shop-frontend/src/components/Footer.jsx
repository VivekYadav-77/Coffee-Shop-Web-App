import React, { useState } from 'react'
import { UserCheck, Check } from 'lucide-react'

const Footer = ({ onEmployeeAuth, onEmployeeAuthRequired, isEmployeeLoggedIn, onNavigate }) => {
  const [emailCopied, setEmailCopied] = useState(false)

  const handleLinkClick = (e, pageName) => {
    e.preventDefault()
    if (pageName === 'Learn about the team') {
      onNavigate('team')
    } else if (pageName === 'Contact us') {
      handleEmailCopy()
    } else {
      alert(`${pageName} page will be added soon!`)
    }
  }

  const handleEmailCopy = async () => {
    const emails = 'brewcraft2025@outlook.com, akshat1972005@gmail.com'
    try {
      await navigator.clipboard.writeText(emails)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 3000) // Hide after 3 seconds
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = emails
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 3000)
    }
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
        
        {isEmployeeLoggedIn && (
          <div className="footer-section">
            <h3>For Employees</h3>
            <ul>
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
          </div>
        )}
        
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 BREW CRAFT Coffee. All rights reserved. Crafted with ❤️ for coffee lovers worldwide.</p>
      </div>
      
      {/* Email Copied Indicator */}
      {emailCopied && (
        <div className="email-copied-indicator">
          <Check size={20} />
          <span>Emails copied to clipboard!</span>
        </div>
      )}
    </footer>
  )
}

export default Footer