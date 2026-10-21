/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          'card-foreground': 'hsl(var(--foreground))',
          'primary-foreground': '#ffffff',
          'accent-foreground': 'hsl(var(--foreground))',
          popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--foreground))' },
          secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--foreground))' },
          muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
          destructive: { DEFAULT: '#be123c', foreground: '#ffffff' },
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
  			primary: 'rgb(180 87 107 / <alpha-value>)',
  			'primary-light': 'rgb(212 136 154 / <alpha-value>)',
  			'primary-dark': 'rgb(139 63 82 / <alpha-value>)',
  			accent: 'rgb(166 139 91 / <alpha-value>)',
  			'accent-light': 'rgb(201 168 117 / <alpha-value>)',
  			success: 'rgb(63 125 92 / <alpha-value>)',
  			warning: 'rgb(176 122 43 / <alpha-value>)',
  			danger: 'rgb(180 69 63 / <alpha-value>)',
  			text: {
  				primary: 'rgb(62 44 53 / <alpha-value>)',
  				secondary: 'rgb(107 85 96 / <alpha-value>)',
  				muted: 'rgb(153 144 136 / <alpha-value>)'
  			},
  			card: 'rgb(255 255 255 / <alpha-value>)',
  			canvas: 'rgb(251 247 244 / <alpha-value>)',
  			'canvas-alt': 'rgb(245 239 233 / <alpha-value>)',
  			border: {
                  DEFAULT: 'hsl(var(--input))',
  				primary: 'rgb(237 228 222 / <alpha-value>)',
  				light: 'rgb(245 239 233 / <alpha-value>)'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			serif: [
  				'Playfair Display',
  				'serif'
  			],
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		spacing: {
  			'128': '32rem'
  		},
  		borderRadius: {
  			sm: '8px',
  			md: '16px',
  			lg: '20px'
  		},
  		boxShadow: {
  			sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  			md: '0 4px 12px rgba(0, 0, 0, 0.08)',
  			lg: '0 12px 24px rgba(0, 0, 0, 0.12)'
  		},
  		transitionDuration: {
  			fast: '150ms',
  			base: '200ms',
  			slow: '300ms'
  		}
  	}
  },
  safelist: [
    'bg-primary',
    'text-primary',
    'border-primary',
    'hover:bg-primary-dark',
    'bg-success',
    'text-success',
    'bg-warning',
    'text-warning',
    'bg-danger',
    'text-danger',
    'bg-canvas',
    'bg-canvas-alt',
    'bg-card',
    'text-text-primary',
    'text-text-secondary',
    'rounded-sm',
    'rounded-md',
    'rounded-lg',
    'shadow-sm',
    'shadow-md',
    'shadow-lg',
    'duration-fast',
    'duration-base',
    'duration-slow',
  ],
  plugins: [],
}
