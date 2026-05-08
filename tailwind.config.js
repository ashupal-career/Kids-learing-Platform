/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // Animations
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'shake': 'shake 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'scale-pulse': 'scalePulse 1.5s ease-in-out infinite',
        'rainbow': 'rainbow 3s ease-in-out infinite',
      },
      
      // Box Shadows
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(255,255,255,0.5)',
        'glow-lg': '0 0 30px rgba(255,255,255,0.6)',
        'inner-glow': 'inset 0 0 10px rgba(255,255,255,0.3)',
        'neon': '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 20px #00ff00',
        'card': '0 20px 35px -10px rgba(0, 0, 0, 0.3)',
      },
      
      // Background Images
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/src/assets/hero-bg.png')",
        'stars': "url('/src/assets/stars.png')",
      },
      
      // Colors (Custom)
      colors: {
        'kid-blue': '#3B82F6',
        'kid-pink': '#EC4899',
        'kid-green': '#22C55E',
        'kid-yellow': '#EAB308',
        'kid-purple': '#A855F7',
        'kid-orange': '#F97316',
      },
      
      // Keyframes for Custom Animations
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        glowPulse: {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(255,255,255,0.3)',
            opacity: '0.8'
          },
          '50%': { 
            boxShadow: '0 0 20px rgba(255,255,255,0.6)',
            opacity: '1'
          },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        rainbow: {
          '0%': { filter: 'hue-rotate(0deg)' },
          '100%': { filter: 'hue-rotate(360deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      
      // Spacing
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      
      // Border Radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      
      // Font Family
      fontFamily: {
        'comic': ['Comic Neue', 'Comic Sans MS', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      
      // Font Sizes
      fontSize: {
        'xxs': '0.625rem',
        '7xl': '5rem',
        '8xl': '6rem',
        '9xl': '8rem',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}