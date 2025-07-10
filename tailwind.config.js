/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        verdeClaro: "#BDF2D4",       // cor clara da quadra
        verdePrincipal: "#4CAF50",   // verde escuro
        verdeSuave: "#A3D9A5"        // verde mais suave
      }
    },
  },
  plugins: [],
}
