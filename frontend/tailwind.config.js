/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Указывает Tailwind на файлы, в которых используются классы
  ],
  theme: {
    extend: {
      colors: {
        bej: '#F7F6F6', // Добавление пользовательского цвета
      },
    },
  },
  plugins: [],
};
