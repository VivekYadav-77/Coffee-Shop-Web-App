/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        // Assumes you have an image at `public/hero-background.jpg`
        'hero-background': "url('/hero-background.jpg')",
        'product-detail': 'linear-gradient(135deg, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #533483 75%, #764ba2 100%)',
      },
       theme: {
    extend: {
      fontFamily: {
        'bangers': ['Bangers', 'cursive'], // Add this line
      },
    },
  },
      keyframes: {
        'slide-in-bottom': {
          '0%': {
            transform: 'translateY(50px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-15px)' },
        },
         steam: {
          '0%': {
            opacity: '0',
            transform: 'translateY(100px) scale(0.5)',
          },
          '50%': {
            opacity: '0.6',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-100px) scale(1.5)',
          },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
        titleGlow: {
          '0%': { filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.3))' },
          '100%': { filter: 'drop-shadow(0 0 30px rgba(255, 107, 107, 0.6))' },
        },
        coffeeFloat: {
          '0%, 100%': { 
            transform: 'translateY(0px) rotate(0deg) scale(1)', 
            opacity: '0.8',
          },
          '50%': { 
            transform: 'translateY(-30px) rotate(180deg) scale(1.1)', 
            opacity: '0.6',
          },
        }
      },
      animation: {
        'slide-in-bottom': 'slide-in-bottom 0.7s cubic-bezier(0.250, 0.460, 0.450, 0.940) forwards',
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'steam': 'steam 4s ease-in-out infinite',
        'title-glow': 'titleGlow 3s ease-in-out infinite alternate',
        'coffee-float': 'coffeeFloat 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
