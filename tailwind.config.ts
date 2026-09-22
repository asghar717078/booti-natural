import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'dark-green': '#1B3B1A',
        'gold': '#D4A017',
        'light-gold': '#F0C75E',
        'light-grey': '#F5F5F5',
        'light-green': '#F0F7F0',
        'cream': '#FAFAF7',
        'text-dark': '#1A1A1A',
        'text-grey': '#6B7280',
      },
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
