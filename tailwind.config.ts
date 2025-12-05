import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        instagram: {
          blue: "#0095f6",
          "blue-hover": "#1877f2",
          border: "#dbdbdb",
          background: "#fafafa",
          text: "#262626",
          "text-light": "#8e8e8e",
        },
      },
    },
  },
  plugins: [],
};
export default config;
