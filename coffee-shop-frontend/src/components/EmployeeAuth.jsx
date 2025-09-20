import React, { useState } from 'react'
import { Eye, EyeOff, UserCheck, ArrowLeft } from 'lucide-react'

const EmployeeAuth = ({ onLogin, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    employeeName: '',
    department: 'cafe',
    employeeCode: ''
  })
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.employeeCode) {
      newErrors.employeeCode = 'Employee code is required'
    } else if (!/^EMP\d{4}$/.test(formData.employeeCode)) {
      newErrors.employeeCode = 'Employee code must be in format EMP1234'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (!isLogin) {
      if (!formData.employeeName) {
        newErrors.employeeName = 'Employee name is required'
      }
      if (!formData.email) {
        newErrors.email = 'Personal email is required'
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address'
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

    const demoEmployeeCodes = {
      'EMP1001': 'admin123',
      'EMP1002': 'manager456', 
      'EMP1003': 'barista789',
      'EMP1004': 'kitchen123',
      'EMP1005': 'delivery456'
    }

    if (isLogin) {
      if (demoEmployeeCodes[formData.employeeCode] === formData.password) {
        const employeeData = {
          id: Date.now(),
          type: 'employee',
          employeeName: 'Employee',
          employeeCode: formData.employeeCode,
          department: 'Unknown',
          loginTime: new Date().toISOString()
        }
        onLogin(employeeData)
      } else {
        setErrors({ 
          employeeCode: 'Invalid employee code or password',
          password: 'Invalid employee code or password'
        })
      }
    } else {
      setTimeout(() => {
        const employeeData = {
          id: Date.now(),
          type: 'employee',
          employeeName: formData.employeeName,
          email: formData.email,
          department: formData.department,
          employeeCode: formData.employeeCode,
          loginTime: new Date().toISOString()
        }
        onLogin(employeeData)
      }, 1000)
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      employeeName: '',
      department: 'cafe',
      employeeCode: ''
    })
    setErrors({})
  }

  return (
    <div className="auth-container employee-auth" style={{
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
        <div className="auth-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
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
              <UserCheck size={40} style={{ color: '#667eea' }} />
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>BREW CRAFT EMPLOYEE</h2>
            </div>
          </div>

          <h3 style={{ 
            fontFamily: "'Space Grotesk', sans-serif", 
            fontSize: '2rem', 
            fontWeight: 700, 
            textAlign: 'center', 
            marginBottom: '0.5rem' 
          }}>
            {isLogin ? 'Employee Portal Access' : 'Employee Registration'}
          </h3>
          
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            textAlign: 'center', 
            marginBottom: '2rem', 
            lineHeight: 1.5, 
            fontSize: '0.95rem' 
          }}>
            {isLogin 
              ? 'Enter your employee code and password to access the management system'
              : 'Register as a new employee with your assigned employee code'
            }
          </p>

          {isLogin && (
            <div style={{
              background: 'rgba(102, 126, 234, 0.1)',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'rgba(255, 255, 255, 0.8)'
            }}>
              <strong style={{color: '#667eea'}}>Demo Login Codes:</strong><br/>
              EMP1001 / admin123 (Admin)<br/>
              EMP1002 / manager456 (Manager)<br/>
              EMP1003 / barista789 (Barista)
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                Employee Code
              </label>
              <input
                type="text"
                name="employeeCode"
                value={formData.employeeCode}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: `1px solid ${errors.employeeCode ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '1rem 1.2rem',
                  color: 'white',
                  fontSize: '1rem',
                  backdropFilter: 'blur(20px)',
                  boxSizing: 'border-box',
                  textTransform: 'uppercase'
                }}
                placeholder="EMP1234"
              />
              {errors.employeeCode && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.employeeCode}</span>}
              <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '0.25rem', fontStyle: 'italic', display: 'block' }}>
                Format: EMP followed by 4 digits
              </small>
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
              <>
                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={formData.employeeName}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: `1px solid ${errors.employeeName ? '#ff4757' : 'rgba(255, 255, 255, 0.2)'}`,
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      color: 'white',
                      fontSize: '1rem',
                      backdropFilter: 'blur(20px)',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your full name"
                  />
                  {errors.employeeName && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.employeeName}</span>}
                </div>

                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Personal Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
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
                    placeholder="your.email@gmail.com"
                  />
                  {errors.email && <span style={{ color: '#ff4757', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                  <small style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.8rem', marginTop: '0.25rem', fontStyle: 'italic', display: 'block' }}>
                    Use your personal email address
                  </small>
                </div>

                <div>
                  <label style={{ color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500, fontSize: '0.9rem', marginBottom: '0.5rem', display: 'block' }}>
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '1rem 1.2rem',
                      color: 'white',
                      fontSize: '1rem',
                      backdropFilter: 'blur(20px)',
                      boxSizing: 'border-box',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="cafe" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Café Operations</option>
                    <option value="kitchen" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Kitchen</option>
                    <option value="management" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Management</option>
                    <option value="delivery" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Delivery</option>
                    <option value="customer-service" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Customer Service</option>
                    <option value="admin" style={{ background: 'rgba(26, 26, 46, 0.9)', color: 'white' }}>Administration</option>
                  </select>
                </div>

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
              </>
            )}

            <button 
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
              {isLogin ? 'Access Employee Portal' : 'Register as Employee'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
              {isLogin ? "New employee? " : "Already registered? "}
              <button 
                type="button" 
                onClick={toggleMode}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#667eea',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                {isLogin ? 'Register Here' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeAuth