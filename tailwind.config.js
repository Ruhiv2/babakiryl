/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#4A90E2',
        'text-primary': '#2D3748',
        'error-red': '#E53E3E',
        'border-gray': '#E2E8F0',
      },
    },
  },
  plugins: [],
};