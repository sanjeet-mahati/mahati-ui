/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  corePlugins: {
    preflight: false, // Disable global resets
  },
  theme: {
    extend: {},
  },
  plugins: [require("tailwindcss-animate")],
};
