/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // --- Restored Celoris Custom Colors ---
        // Primary brand colors (Celoris)
        primary: {
          DEFAULT: '#2C7A4F', // Set 500 as default to avoid breaking 'bg-primary' if used
          50: '#EAF2ED',
          100: '#C1DBC9',
          500: '#2C7A4F',
          700: '#215B3B',
          900: '#163C28',
          // Edustream Primary (merged as 'edu')
          edu: '#4F46E5',
          // Shadcn mapping (if needed, or use specific shades)
          foreground: "hsl(var(--primary-foreground))",
        },
        // Neutral system
        // background: '#F8F9FA', // Conflict with shadcn 'background'. Using shadcn's.
        // surface: '#FFFFFF', // Conflict with Edustream 'surface'.

        // Renaming Celoris 'surface' to 'surface-legacy' if needed, or keeping if unused.
        // Edustream uses 'surface' = '#F8FAFC'.
        // Celoris used 'surface' = '#FFFFFF'.
        // I'll use Edustream's for now as it's needed for the new views.
        // If Celoris uses 'bg-surface', it will change slightly.
        surface: '#F8FAFC',

        border: {
          DEFAULT: "hsl(var(--border))", // Shadcn
          subtle: '#E9ECEF', // Celoris
          strong: '#DEE2E6', // Celoris
        },
        text: {
          primary: '#212529',
          secondary: '#6C757D',
        },
        // Semantic colors
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',

        // Brand colors from new UI
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },

        // --- Shadcn/UI Colors ---
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))", // Shadcn background
        foreground: "hsl(var(--foreground))",

        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          // Edustream Secondary
          edu: '#64748B',
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          // Edustream Accent
          edu: '#0EA5E9',
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in": {
          "0%": { opacity: 0, transform: "translateY(10px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
        // Edustream Animation
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}