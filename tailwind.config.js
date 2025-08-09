/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#CEA472',
          light: '#E6CBA0',
          dark: '#A67C52',
        },
        brown: {
          DEFAULT: '#754831',
          light: '#A67C52',
          dark: '#4B2E1D',
        },
      },
    },
  },
  plugins: [],
} 