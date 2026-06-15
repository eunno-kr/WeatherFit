/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
        display: ["Archivo", "Pretendard", "system-ui", "sans-serif"],
      },
      colors: {
        paper: "#FAF8F3",
        ink: "#1A1A1A",
      },
    },
  },
  plugins: [],
};
