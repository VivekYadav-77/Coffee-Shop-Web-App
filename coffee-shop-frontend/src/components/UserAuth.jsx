import React, { useState } from 'react'
import { Eye, EyeOff, Coffee, ArrowLeft } from 'lucide-react'

const UserAuth = ({ onLogin, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })
  const [errors, setErrors] = useState({})

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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    // Frontend demo validation - your friend will replace this with backend API call
    const demoUsers = {
      'Akshat@gmail.com': { password: 'user123', name: 'Akshat' },
      'Shivang@gmail.com': { password: 'coffee456', name: 'Shivang' },
      'Raj@yahoo.com': { password: 'brew789', name: 'Raj' },
      'Vivek@gmail.com': { password: 'latte123', name: 'Vivek' }
    }

    if (isLogin) {
      // Check if user email and password match (demo validation)
      const demoUser = demoUsers[formData.email]
      if (demoUser && demoUser.password === formData.password) {
        const userData = {
          id: Date.now(),
          type: 'user',
          name: demoUser.name,
          email: formData.email,
          loginTime: new Date().toISOString()
        }
        
        onLogin(userData)
      } else {
        setErrors({ 
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        })
      }
    } else {
      // For signup, simulate success (backend will handle registration)
      setTimeout(() => {
        const userData = {
          id: Date.now(),
          type: 'user',
          name: formData.name,
          email: formData.email,
          loginTime: new Date().toISOString()
        }
        
        onLogin(userData)
      }, 1000)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    })
    setErrors({})
  }

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card">
          <div className="auth-header">
            <button className="back-btn" onClick={onCancel}>
              <ArrowLeft size={20} />
            </button>
            <div className="auth-logo">
              <Coffee size={40} className="auth-logo-icon" />
              <h2>BREW CRAFT</h2>
            </div>
          </div>

          <div className="auth-form-container">
            <h3 className="auth-title">
              {isLogin ? 'Welcome Back!' : 'Join Our Coffee Community'}
            </h3>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Sign in to access your account and continue your coffee journey'
                : 'Create your account and discover amazing coffee experiences'
              }
            </p>

            {/* Demo credentials info for testing */}
            {isLogin && (
              <div style={{
                background: 'rgba(255, 107, 107, 0.1)',
                border: '1px solid rgba(255, 107, 107, 0.3)',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'rgba(255, 255, 255, 0.8)'
              }}>
                <strong style={{color: '#ff6b6b'}}>Demo User Accounts:</strong><br/>
                Akshat@gmail.com / user123<br/>
                Shivang@gmail.com / coffee456<br/>
                Raj@yahoo.com / brew789<br/>
                Vivek@gmail.com / latte123
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={errors.name ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              )}

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={errors.password ? 'error' : ''}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
              )}

              <button type="submit" className="auth-submit-btn">
                {isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button type="button" className="switch-btn" onClick={toggleMode}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAuth