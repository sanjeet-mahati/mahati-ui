import type { Config } from "tailwindcss";
import { mahatiTheme } from "./src/tailwind-theme";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  // ❌ Disable global reset (Preflight)
  corePlugins: {
    preflight: false,
  },

  // ✅ Use the complete, shared theme definition
  theme: mahatiTheme,

  plugins: [tailwindcssAnimate],
};

export default config;
