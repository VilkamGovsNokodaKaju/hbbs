import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/_components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  daisyui: {
    themes: [
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "base-100": "#49111C",
          "base-content": "FFD400",
          "base-200": "#806A00",
        }
      }
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
};
export default config;
