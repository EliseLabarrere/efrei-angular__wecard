/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        myBlack: '#131a29',
        myLightGray: '#f8f7f6',
        myWhite: '#ffffff',
        myDarkBlue: '#131a29',
        myOrange: '#f39359',
        myTeal: '#53b2aa',
        myPurple: '#655fe5',
        myBeige: '#f7ede6',

        primary: "#f39359",
        "background-light": "#f8f7f6",
        "background-dark": "#221710"
      },
      fontFamily: {
        display: "Spline Sans"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      }
    }
  },
  plugins: [],
}