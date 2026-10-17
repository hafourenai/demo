/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',
        secondary: '#A78BFA',
        accent: '#06B6D4',
      },
      fontFamily: {
        sans: ['system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'hover:bg-pink-700',
    'bg-gradient-to-br',
    'from-primary',
    'to-secondary',
    'to-pink-500',
    'to-purple-500',
    'bg-gray-50',
    'bg-gray-100',
    'bg-gray-200',
    'bg-white',
    'text-gray-800',
    'text-white',
    'rounded-lg',
    'rounded-3xl',
    'rounded-xl',
    'shadow-lg',
    'shadow-2xl',
    'shadow-md',
    'shadow-sm',
    'p-4',
    'p-8',
    'px-4',
    'py-3',
  ],
  plugins: [],
}
