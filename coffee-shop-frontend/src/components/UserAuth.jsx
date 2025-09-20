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

    const isEmployeeCode = /^EMP\d{4}$/i.test(formData.email.trim())
    if (!formData.email) {
      newErrors.email = 'Email or Employee Code is required'
    } else if (!isEmployeeCode && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Enter a valid email or EMP code'
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

    // Frontend demo validation
    const demoUsers = {
      'Akshat@gmail.com': { password: 'user123', name: 'Akshat' },
      'Shivang@gmail.com': { password: 'coffee456', name: 'Shivang' },
      'Raj@yahoo.com': { password: 'brew789', name: 'Raj' },
      'Vivek@gmail.com': { password: 'latte123', name: 'Vivek' }
    }
    const demoEmployeeCodes = {
      'EMP1001': 'admin123',
      'EMP1002': 'manager456', 
      'EMP1003': 'barista789',
      'EMP1004': 'kitchen123',
      'EMP1005': 'delivery456'
    }

    if (isLogin) {
      const isEmployeeCode = /^EMP\d{4}$/i.test(formData.email.trim())
      if (isEmployeeCode) {
        const code = formData.email.trim().toUpperCase()
        if (demoEmployeeCodes[code] === formData.password) {
          const employeeData = {
            id: Date.now(),
            type: 'employee',
            employeeName: 'Employee',
            employeeCode: code,
            department: 'Unknown',
            loginTime: new Date().toISOString()
          }
          onLogin(employeeData)
        } else {
          setErrors({ email: 'Invalid employee code or password', password: 'Invalid employee code or password' })
        }
      } else {
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
      }
    } else {
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
    <div className="auth-container" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #764ba2 100%)'
    }}>
      <div className="auth-card" style={{
        background: 'rgba(26, 26, 46, 0.2)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)'
      }}>
        <div className="auth-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }}>
          <div className="auth-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={onCancel}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '0.8rem',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ArrowLeft size={20} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'center' }}>
              <Coffee size={40} style={{ color: '#ff6b6b' }} />
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>BREW CRAFT</h2>
            </div>
          </div>

          <h3 className="auth-title" style={{ 
            fontFamily: "'Space Grotesk', sans-serif", 
            fontSize: '2rem', 
            fontWeight: 700, 
            textAlign: 'center', 
            marginBottom: '0.5rem' 
          }}>
            {isLogin ? 'Welcome Back!' : 'Join Our Coffee Community'}
          </h3>
          
          <p className="auth-subtitle" style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            textAlign: 'center', 
            marginBottom: '2rem', 
            lineHeight: 1.5, 
            fontSize: '0.95rem' 
          }}>
            {isLogin 
              ? 'Sign in to access your account and continue your coffee journey'
              : 'Create your account and discover amazing coffee experiences'
            }
          </p>

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
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem'}}>
                <div>
                  <strong style={{color: '#ff6b6b'}}>Demo Users</strong><br/>
                  Akshat@gmail.com / user123<br/>
                  Shivang@gmail.com / coffee456<br/>
                  Raj@yahoo.com / brew789<br/>
                  Vivek@gmail.com / latte123
                </div>
                <div>
                  <strong style={{color: '#667eea'}}>Demo Employees</strong><br/>
                  EMP1001 / admin123<br/>
                  EMP1002 / manager456<br/>
                  EMP1003 / barista789
                </div>
              </div>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {!isLogin && (
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="auth-input"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.name ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.2rem',
                    color: 'white',
                    fontSize: '1rem',
                    backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your full name"
                />
                {errors.name && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
              </div>
            )}

            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                Email or Employee Code
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="auth-input"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${errors.email ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  color: 'white',
                  fontSize: '1rem',
                  backdropFilter: 'blur(20px)',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter email or EMP code (e.g., EMP1001)"
              />
              {errors.email && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
            </div>

            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="auth-input"
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.password ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.2rem',
                    color: 'white',
                    fontSize: '1rem',
                    backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box',
                    paddingRight: '3rem'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.password}</span>}
            </div>

            {!isLogin && (
              <div>
                <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: `1px solid ${errors.confirmPassword ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                    borderRadius: '12px',
                    padding: '1rem 1.2rem',
                    color: 'white',
                    fontSize: '1rem',
                    backdropFilter: 'blur(20px)',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.confirmPassword}</span>}
              </div>
            )}

            <button 
              type="submit"
              className="auth-button"
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e3c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '1.2rem',
                fontSize: '1.1rem',
                fontWeight: 600,
                fontFamily: "'Space Grotesk', sans-serif",
                cursor: 'pointer',
                marginTop: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                width: '100%'
              }}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                type="button" 
                onClick={toggleMode}
                className="auth-toggle"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff6b6b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>

        {/* Coffee emoji - desktop only */}
        <div className="coffee-visual-desktop" style={{
          flex: 1,
          background: 'rgba(139, 69, 19, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span style={{ fontSize: '6rem', zIndex: 2, filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.4))' }}>☕</span>
        </div>
      </div>
    </div>
  )
}

export default UserAuth