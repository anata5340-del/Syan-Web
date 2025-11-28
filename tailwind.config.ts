import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
      },
      colors: {
        colorgray: "#E3E3E3",
        colorred: "#EF6A77",
        colororange: "#F9954B",
        colorblack: "#3E3E3E",
        colorblue: "#3DA397",
        colordarkblue: "#076BB4",
        colorgreen: "#01B067",
        colorcyan: "#4FB1C1",
      },
    },
  },
  plugins: [],
};
export default config;
