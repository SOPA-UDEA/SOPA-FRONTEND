import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#702082", // 7650 C
          foreground: "#ffffff",
        },
        background: "#fbfffb",
        complementary: {
          633: "#0076A8", // Duplicate of secondary.633
          7650: "#702082",
        },
        error: {
          DEFAULT: "#EA1D25", // 032 C
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#00A78E", // 334 C
          foreground: "#ffffff",
        },
        neutral: {
          10: "#e3e3e3",
          50: "#b3b3b3",
          100: "#ffffff",
          500: "#a4a4a4",
          1000: "#333333",
        },
        primary: {
          349: "#007A33",
          361: "#43B02A",
          375: "#84BD00",
          7740: "#228848",
          DEFAULT: "#43B02A", // 361 C
          foreground: "#ffffff",
        },
        secondary: {
          334: "#00A78E",
          633: "#FFFFFFFF",
          7465: "#00B2A9",
          7718: "#007770",
          DEFAULT: "#00B2A9",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#43B02A",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#FAA61A", // 137 C
          foreground: "#000000",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      fontSize: {
        "h-1": ["48px", { lineHeight: "72px", fontWeight: "700" }],
        "h-2": ["40px", { lineHeight: "60px", fontWeight: "900" }],
        "h-3": ["34px", { lineHeight: "51px", fontWeight: "900" }],
        "body-1": ["16px", { lineHeight: "24px", fontWeight: "400" }],
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#43B02A",
              foreground: "#ffffff",
            },
            secondary: {
              DEFAULT: "#00B2A9",
              foreground: "#ffffff",
            },
            background: "#fbfffb",
            foreground: "#2b3e27",
          },
        },
      },
    }),
  ],
};

export default config;

export const darkTheme = {
  colors: {
    primary: {
      DEFAULT: "#43B02A",
      foreground: "#ffffff",
    },
    secondary: {
      DEFAULT: "#00B2A9",
      foreground: "#ffffff",
    },
    background: "#1a1a1a",
    foreground: "#ffffff",
  },
};
