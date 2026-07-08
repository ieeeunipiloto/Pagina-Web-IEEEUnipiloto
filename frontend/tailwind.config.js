/**
 * tailwind.config.js — Configuración del tema de Tailwind CSS.
 *
 * Define la paleta de colores institucional (primary, danger, dark, cyber),
 * fuentes tipográficas (Bungee Shade para títulos, Segoe UI para texto),
 * y animaciones reutilizables (float, pulse-slow, bounce-slow).
 *
 * Los colores "cyber" se usan en la temática de ciudad inteligente y
 * efectos visuales de la escena 3D.
 *
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          200: '#91d5ff',
          300: '#69c0ff',
          400: '#40a9ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
          800: '#003a8c',
          900: '#002766',
        },
        danger: {
          50: '#fff1f0',
          100: '#ffccc7',
          200: '#ffa39e',
          300: '#ff7875',
          400: '#ff4d4f',
          500: '#f5222d',
          600: '#cf1322',
          700: '#a8071a',
          800: '#820014',
          900: '#5c0011',
        },
        dark: {
          50: '#f5f5f5',
          100: '#d9d9d9',
          200: '#bfbfbf',
          300: '#8c8c8c',
          400: '#595959',
          500: '#434343',
          600: '#262626',
          700: '#1f1f1f',
          800: '#141414',
          900: '#000000',
        },
        cyber: {
          blue: '#00d4ff',
          red: '#ff3b3b',
          purple: '#db2777',
          orange: '#f3961e',
          green: '#059669',
          teal: '#0891b2',
          pink: '#f05f7c',
        },
      },
      fontFamily: {
        pixel: ['"Bungee Shade"', 'cursive'],
        sans: ['Inter', '"Segoe UI"', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'scale-in': 'scaleIn 0.4s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
