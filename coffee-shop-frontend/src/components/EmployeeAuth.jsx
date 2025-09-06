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

    // For login, only check employee code and password
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

    // For signup, check additional fields
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

    // Frontend demo validation - your friend will replace this with backend API call
    const demoEmployeeCodes = {
      'EMP1001': 'admin123',
      'EMP1002': 'manager456', 
      'EMP1003': 'barista789',
      'EMP1004': 'kitchen123',
      'EMP1005': 'delivery456'
    }

    if (isLogin) {
      // Check if employee code and password match (demo validation)
      if (demoEmployeeCodes[formData.employeeCode] === formData.password) {
        const employeeData = {
          id: Date.now(),
          type: 'employee',
          employeeName: 'Employee', // Backend will provide real name
          employeeCode: formData.employeeCode,
          department: 'Unknown', // Backend will provide real department
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
      // For signup, simulate success (backend will handle registration)
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
    <div className="auth-container">
      <div className="auth-background">
        <div className="auth-card employee-auth-card">
          <div className="auth-header">
            <button className="back-btn" onClick={onCancel}>
              <ArrowLeft size={20} />
            </button>
            <div className="auth-logo">
              <UserCheck size={40} className="employee-logo-icon" />
              <h2>BREW CRAFT EMPLOYEE</h2>
            </div>
          </div>

          <div className="auth-form-container">
            <h3 className="auth-title">
              {isLogin ? 'Employee Portal Access' : 'Employee Registration'}
            </h3>
            <p className="auth-subtitle">
              {isLogin 
                ? 'Enter your employee code and password to access the management system'
                : 'Register as a new employee with your assigned employee code'
              }
            </p>

            {/* Demo credentials info for testing */}
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

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="employeeCode">Employee Code</label>
                <input
                  type="text"
                  id="employeeCode"
                  name="employeeCode"
                  value={formData.employeeCode}
                  onChange={handleInputChange}
                  className={errors.employeeCode ? 'error' : ''}
                  placeholder="EMP1234"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.employeeCode && <span className="error-text">{errors.employeeCode}</span>}
                <small className="input-hint">Format: EMP followed by 4 digits</small>
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
                <>
                  <div className="input-group">
                    <label htmlFor="employeeName">Full Name</label>
                    <input
                      type="text"
                      id="employeeName"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleInputChange}
                      className={errors.employeeName ? 'error' : ''}
                      placeholder="Enter your full name"
                    />
                    {errors.employeeName && <span className="error-text">{errors.employeeName}</span>}
                  </div>

                  <div className="input-group">
                    <label htmlFor="email">Personal Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                      placeholder="your.email@gmail.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                    <small className="input-hint">Use your personal email address</small>
                  </div>

                  <div className="input-group">
                    <label htmlFor="department">Department</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="employee-select"
                    >
                      <option value="cafe">Café Operations</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="management">Management</option>
                      <option value="delivery">Delivery</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="admin">Administration</option>
                    </select>
                  </div>

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
                </>
              )}

              <button type="submit" className="employee-submit-btn">
                {isLogin ? 'Access Employee Portal' : 'Register as Employee'}
              </button>
            </form>

            <div className="auth-switch">
              <p>
                {isLogin ? "New employee? " : "Already registered? "}
                <button type="button" className="switch-btn" onClick={toggleMode}>
                  {isLogin ? 'Register Here' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeAuth