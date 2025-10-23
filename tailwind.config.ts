  /* Tailwind config for the frontend react app. This is where the app theme should be defined: https://v2.tailwindcss.com/docs/configuration. */
  import type { Config } from 'tailwindcss'
  import animatePlugin from 'tailwindcss-animate'
  import typographyPlugin from '@tailwindcss/typography'
  import aspectRatioPlugin from '@tailwindcss/aspect-ratio'

  export default {
    darkMode: ['class'],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
      container: {
        center: true,
        padding: '2rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1200px',
        },
      },
      extend: {
        fontFamily: {
          sans: ['Outfit', 'system-ui', 'sans-serif'],
          display: ['Outfit', 'system-ui', 'sans-serif'],
        },
        colors: {
          border: 'hsl(var(--border))',
          input: 'hsl(var(--input))',
          ring: 'hsl(var(--ring))',
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))',
          },
          destructive: {
            DEFAULT: 'hsl(var(--destructive))',
            foreground: 'hsl(var(--destructive-foreground))',
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))',
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))',
          },
          'accent-1': 'hsl(var(--accent-1))',
          'accent-2': 'hsl(var(--accent-2))',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 4px)',
          sm: 'calc(var(--radius) - 8px)',
        },
        keyframes: {
          'accordion-down': {
            from: { height: '0' },
            to: { height: 'var(--radix-accordion-content-height)' },
          },
          'accordion-up': {
            from: { height: 'var(--radix-accordion-content-height)' },
            to: { height: '0' },
          },
          'fade-in-up': {
            '0%': { opacity: '0', transform: 'translateY(20px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
          },
          pulse: {
            '0%, 100%': {
              transform: 'scale(1)',
              boxShadow: '0 0 0 0 rgba(0, 255, 255, 0.7)',
            },
            '50%': {
              transform: 'scale(1.1)',
              boxShadow: '0 0 10px 10px rgba(0, 255, 255, 0)',
            },
          },
          'slow-pan': {
            '0%': { backgroundPosition: '0% 0%' },
            '100%': { backgroundPosition: '100% 100%' },
          },
          'slow-zoom': {
            '0%': { transform: 'scale(1)' },
            '100%': { transform: 'scale(1.05)' },
          },
          'logo-pulse': {
            '50%': {
              opacity: '0.6',
            },
          },
        },
        animation: {
          'accordion-down': 'accordion-down 0.2s ease-out',
          'accordion-up': 'accordion-up 0.2s ease-out',
          'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'slow-pan': 'slow-pan 30s ease-in-out infinite alternate',
          'slow-zoom': 'slow-zoom 30s ease-in-out infinite alternate',
          'logo-pulse': 'logo-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [animatePlugin, typographyPlugin, aspectRatioPlugin],
  } satisfies Config
