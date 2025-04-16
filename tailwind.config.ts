import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const newPrimaryColors = {
  "50": "#faf9f8",
  "100": "#f3f1f0",
  "200": "#e8e6e3",
  "300": "#ddd9d6", // Your original base
  "400": "#c4c0bd",
  "500": "#aba7a4",
  "600": "#928e8b",
  "700": "#797572",
  "800": "#605c59",
  "900": "#474340",
  foreground: "#2e2a27", // For text on primary
  DEFAULT: "#ddd9d6",
};

const newSecondaryColors = {
  "50": "#f4f3f2",
  "100": "#e9e6e4",
  "200": "#d4cdc8",
  "300": "#beb3ab",
  "400": "#a89a8f",
  "500": "#928173",
  "600": "#7c6b5e",
  "700": "#65564a",
  "800": "#4e4138",
  "900": "#382d25",
  foreground: "#ffffff",
  DEFAULT: "#928173",
};

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#fbfffb",
        primary: newPrimaryColors,
        secondary: newSecondaryColors,
      },
      fontFamily: {
        sansation: ["var(--font-sansation)", "sans-serif"],
        inter: ["var(--font-inter)", "Arial"],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              ...newPrimaryColors,
              DEFAULT: newPrimaryColors.DEFAULT, // this ensures bg-primary works
            },
            secondary: newSecondaryColors,
            background: "#fbfffb", // Base background for HeroUI light theme
            foreground: "#2b3e27", // Base foreground for HeroUI light theme (kept from original)
          },
        },
        // Define your 'dark' theme here if needed
        // dark: {
        //   colors: {
        //      primary: newPrimaryColors,
        //      secondary: newSecondaryColors,
        //      background: newSecondaryColors["900"], // Example
        //      foreground: newPrimaryColors["100"],   // Example
        //   }
        // }
      },
    }),
  ],
};
export default config;
