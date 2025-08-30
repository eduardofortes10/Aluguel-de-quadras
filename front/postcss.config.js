export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  safelist: [
    "from-[var(--grad-from)]",
    "via-[var(--grad-via)]",
    "to-[var(--grad-to)]",
    "text-brand",
    "text-brand-strong",
    "bg-brand",
  ],
  theme: { extend: {} },
  plugins: [],
};
