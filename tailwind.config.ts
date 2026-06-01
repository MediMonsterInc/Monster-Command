import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        monster: {
          black: "#060509",
          panel: "#121018",
          panel2: "#1b1426",
          green: "#9cff00",
          purple: "#a749ff",
          cyan: "#00e5ff",
          pink: "#ff3df2",
        },
      },
      boxShadow: {
        monster: "0 24px 70px rgba(0, 0, 0, 0.45)",
        slime: "0 0 22px rgba(156, 255, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
