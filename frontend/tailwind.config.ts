import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ['class'],
    content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		colors: {
  			/* ZenSei Brand Colors */
  			'zen-primary': '#7C3AED',
  			'zen-secondary': '#06B6D4',
  			'zen-accent': '#059669',
  			'zen-purple': '#8B5CF6',
  			'zen-cyan': '#06b6d4',
  			'zen-green': '#10b981',
  			'zen-amber': '#f59e0b',
  			'zen-rose': '#f43f5e',
  			'zen-50': '#f8fafc',
  			'zen-900': '#0f172a',
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: 'var(--font-sans)',
  			display: 'var(--font-display)',
  			mono: 'var(--font-mono)'
  		},
  		spacing: {
  			zen: 'var(--spacing-zen)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'scroll': {
  				'0%': { transform: 'translateX(0)' },
  				'100%': { transform: 'translateX(calc(-100% - 2rem))' }
  			},
  			'scroll-reverse': {
  				'0%': { transform: 'translateX(calc(-100% - 2rem))' },
  				'100%': { transform: 'translateX(0)' }
  			},
  			'twinkle': {
  				'0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
  				'50%': { opacity: '1', transform: 'scale(1.2)' }
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'scroll': 'scroll 40s linear infinite',
  			'scroll-reverse': 'scroll-reverse 35s linear infinite',
  			'twinkle': 'twinkle 2s ease-in-out infinite'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography')
  ],
}

export default config 