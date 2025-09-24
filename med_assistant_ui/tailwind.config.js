/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        softPink: "#F7D8D9",
        softBlue: "#A1DBE5",
        softPeach: "#FFD8C0",
        tealGreen: "#00B7AF",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 8s ease infinite",
        "spinSlow": "spin 4s linear infinite",
      },
    },
  },
  plugins: [],
}

