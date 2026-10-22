/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Verde: botões e detalhes de ação
        jaca: {
          50: '#eef7f1',
          100: '#d6ebdd',
          500: '#3a9160',
          600: '#2a7a49',
          700: '#216339',
          800: '#194d2d',
          900: '#10281a',
        },
        // Amarelo/dourado: destaques e aviso de login
        gold: {
          100: '#fdf3c9',
          300: '#f9dc6d',
          400: '#f6c935',
          500: '#e8b410',
          700: '#8a6a00',
        },
        cream: '#f6f1e1',
        paper: '#fbfaf6',
        ink: '#14231a',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(20,35,26,.06), 0 8px 24px rgba(20,35,26,.06)',
      },
    },
  },
  plugins: [],
};
