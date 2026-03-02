import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lapis-deep': '#0D33A6',
        'lapis-medium': '#3258A6',
        'midnight-shale': '#141A26',
        'slate-blue': '#3B4859',
        'gold-fleck': '#D9AE89',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
