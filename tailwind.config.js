/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
  colors: {
    verdeClaro: "#BDF2D4",
    verdePrincipal: "#4CAF50",
    verdeSuave: "#A3D9A5",
  },
  keyframes: {
    "fade-in-down": {
      "0%": {
        opacity: "0",
        transform: "translateY(-10px)",
      },
      "100%": {
        opacity: "1",
        transform: "translateY(0)",
      },
    },
  },
  animation: {
    "fade-in-down": "fade-in-down 0.3s ease-out",
  },
},
  },
  plugins: [],
}
