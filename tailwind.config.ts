import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F5EEE4",
        ink: "#3B2416",
        mute: "#8C6B4F",
        line: "#E6D4B8",
        cocoa: "#A04F17",
        sage: "#A04F17",
        kraft: "#D28141",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        menu: "40rem",
      },
    },
  },
  plugins: [],
};

export default config;
