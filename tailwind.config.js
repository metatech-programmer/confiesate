/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "lacquer": ["Lacquer", "open-sans", "sans-serif"],
        "open-sans": ["open-sans", "sans-serif"],
      },
      colors: {
        app: {
          purple: "#351330",
          bluePurple: "#424254",
          blue: "#64908a",
          soft: "#e8caa4",
          red: "#cc2a41",
        }
      },
      animation: {
        "fade-in-up": "fadeInUp 1s ease-out",
        "fade-in": "fadeIn .5s ease-out",
        "expand": "expand .5s ease-out",	
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        expand: {
          "0%": {
            transform: "scale(0)",
            borderRadius: "10%",
            transformOrigin: "center",
          },
          "100%": {
            transform: "scale(1)",
            borderRadius: "0px",
            transformOrigin: "center",

          },
        },
      },
    },
  },
  plugins: [

  ],
}