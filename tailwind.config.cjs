/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#222831",
        secondaryColor: "#393E46",
        dashboardSecondaryColor: "#6B728E",
        tertiaryColor: "#9F73AB",
        textColor: "#EEEEEE",
      },
    },
  },
  plugins: [],
};
