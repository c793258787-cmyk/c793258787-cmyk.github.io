import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#121214",
        panel: "#18181b",
        line: "#27272a",
        maple: "#f43f5e",
        meso: "#fbbf24",
        leaf: {
          50: "#eefaf1",
          100: "#d6f3de",
          600: "#26854a",
          700: "#1f6b3d"
        },
        ember: {
          100: "#ffe6d3",
          500: "#f97316"
        }
      },
      boxShadow: {
        soft: "0 10px 28px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
