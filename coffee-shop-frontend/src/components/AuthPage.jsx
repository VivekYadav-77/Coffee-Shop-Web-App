// src/components/AuthPage.jsx
import React, { useState } from 'react'

const AuthPage = ({ onLogin, from }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulate successful login/signup
    setTimeout(() => {
      onLogin({ email, name: isLogin ? 'User' : name })
    }, 500)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">
            {isLogin ? 'Welcome Back' : 'Join BREW CRAFT'}
          </h2>
          <p className="auth-subtitle">
            {isLogin
              ? 'Sign in to continue to your coffee journey'
              : 'Create an account to start ordering'}
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength="6"
                required
              />
            </div>

            <button type="submit" className="auth-cta-button">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-toggle">
            {isLogin ? (
              <p>
                New here?{' '}
                <span onClick={() => setIsLogin(false)}>Create an account</span>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <span onClick={() => setIsLogin(true)}>Sign in</span>
              </p>
            )}
          </div>
        </div>

        <div className="auth-visual">
          <div className="coffee-steam"></div>
          <div className="coffee-steam delay-1"></div>
          <div className="coffee-steam delay-2"></div>
          <span className="coffee-emoji">☕</span>
        </div>
      </div>
    </div>
  )
}

export default AuthPage