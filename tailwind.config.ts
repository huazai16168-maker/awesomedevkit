import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#080b12",
        paper: "#f7f3ec",
        line: "#d9d4ca",
        acid: "#c7ff4d"
      }
    }
  },
  plugins: []
};

export default config;
