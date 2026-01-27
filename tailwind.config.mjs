/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        siglo: {
          black: '#000000',
          white: '#FFFFFF',
          'white-off': '#FAFAFA',
          red: '#E63946',
          'red-spanish': '#C1121F',
          'red-deep': '#8B0000',
          gold: '#D4AF37',
          'gold-rich': '#B8860B',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'scroll': 'scroll 2s ease-in-out infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateY(0)', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { transform: 'translateY(12px)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
