/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primaryColor: "#222831",
        secondaryColor: "#393E46",
        dashboardSecondaryColor: "#6B728E",
        tertiaryColor: "#9F73AB",
        textColor: "#EEEEEE",
        primaryColorL: "#FFFBF5",
        secondaryColorL: "#F7EFE5",
        dashboardSecondaryColorL:"#6D9886",
        tertiaryColorL: "#678983",
        textColorL: "#3A8891",
      },
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
