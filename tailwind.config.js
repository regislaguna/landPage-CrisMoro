/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,tsx,jsx,mdx}',
    './src/app/**/*.{js,ts,tsx,jsx,mdx}'
  ],
  theme: {
    screens: {
      mb: "429px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      awesome: "FontAwesome"
    },
    extend: {
      colors: {
        // Paleta de Fundo
        'bg-light': '#F5F5F5',
        'bg-pale': '#FFF9F0',

        // Paleta de Texto (Primárias)
        'text-dark': '#333333',
        'text-medium': '#666666',

        // Paleta de Acentos (Ouro Rosado)
        'accent-dark': '#B76E79',
        'accent-light': '#D4A5A5',

        // Neutros
        'bg-cream': '#FFF8E7',
      },
      keyframes: {
        fadeSlide: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeSlide: 'fadeSlide 0.8s ease-out forwards',
      },
    },
  },
  plugins: [],
}
