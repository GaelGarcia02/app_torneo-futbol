// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Aquí puedes agregar colores, fuentes, etc.
    },
    screens: {
      wearable: "200px", // Wearables: smartwatches
      sm: "430px", // Smartphones modernos
      md: "768px", // Tablets
      lg: "1024px", // Laptops o tablets grandes
      xl: "1280px", // TVs HD
      "2xl": "1536px", // TVs Full HD y monitores grandes
    },
  },
  plugins: [],
  darkMode: "class", // Puedes usar 'media' si prefieres automático según sistema
};
