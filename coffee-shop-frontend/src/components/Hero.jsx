import React from 'react'
import { ChevronDown } from 'lucide-react'

const Hero = ({ onExploreClick }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">
          Welcome to <span>BREW CRAFT</span>
        </h1>
        <p className="hero-subtitle">
          Experience the finest coffee crafted with passion, served with love. 
          From premium beans to perfect brewing, every cup tells a story of excellence.
        </p>
        <div className="hero-buttons">
          <button className="cta-button" onClick={onExploreClick}>
            Explore Menu
          </button>
        </div>
      </div>
      
      <div className="scroll-indicator" onClick={onExploreClick}>
        <div className="scroll-text">Scroll</div>
        <ChevronDown size={24} className="scroll-arrow" />
      </div>
    </section>
  )
}

export default Hero