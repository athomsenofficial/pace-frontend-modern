/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 2025 Nature Green Color Scheme - Fresh & Professional
        primary: {
          DEFAULT: '#4CAF50', // Vibrant Green - Growth & Trust
          dark: '#388E3C',    // Forest Green
          light: '#66BB6A',   // Light Green
        },
        slate: {
          950: '#0a1612',  // Deep Forest
          900: '#1a2821',  // Dark Green Gray
          800: '#2d3e36',  // Forest Gray
          700: '#3f5249',  // Medium Green Gray
          600: '#5a6f63',  // Cool Green Gray
          500: '#7a8f82',  // Neutral Green
          400: '#9fb0a6',  // Light Green Gray
          300: '#c4d0ca',  // Soft Green
          200: '#e0e7e4',  // Pale Green
          100: '#f0f4f2',  // Very Light Green
          50: '#f8faf9',   // Almost White Green
        },
        success: {
          DEFAULT: '#66BB6A', // Bright Green - Success
          dark: '#4CAF50',    // Deep Green
          light: '#81C784',   // Light Success
        },
        warning: {
          DEFAULT: '#FFA726', // Warm Orange - Caution
          dark: '#FB8C00',    // Deep Orange
          light: '#FFB74D',   // Light Orange
        },
        danger: {
          DEFAULT: '#EF5350', // Coral Red - Alert
          dark: '#E53935',    // Deep Red
          light: '#EF7674',   // Light Red
        },
        special: {
          DEFAULT: '#26A69A', // Teal - Highlight
          dark: '#00897B',    // Deep Teal
          light: '#4DB6AC',   // Light Teal
        },
        accent: {
          DEFAULT: '#8BC34A', // Lime Green - Accent
          dark: '#7CB342',    // Deep Lime
          light: '#9CCC65',   // Light Lime
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-in',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}