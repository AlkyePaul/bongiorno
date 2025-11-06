/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base
        black: "#000000",
        white: "#ffffff",

        // Project brand tokens (migrated from globals.css @theme)
        "brand-petrol": "#3C5463",
        "brand-hero": "#4E6C84",
        "brand-navy": "#0A2342",
        "brand-accent": "#00B0E8",
        "brand-dark": "#1D1D25",

        // Brand
        primary: {
          DEFAULT: "#02365b",
          dark: "#012b49",     // ≈ darken($primary, 10%)
          light: "#034b7d",    // ≈ lighten($primary, 10%)
        },
        secondary: {
          DEFAULT: "#00133a",
          dark: "#000e2c",     // ≈ darken($secondary, 10%)
        },
        accent: {
          DEFAULT: "#41c7f3",
          dark: "#24a8d4",     // ≈ darken($accent, 10%)
        },

        // Grayscale
        gray: {
          dark: "#1f2937",
          medium: "#536c82",
          light: "#f3f4f6",
        },
        text: "#1f2937",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },

      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          sm: "2rem",
          lg: "3rem",
          xl: "4rem",
        },
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },

      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.08)",
        card: "0 6px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [


  ],
};
