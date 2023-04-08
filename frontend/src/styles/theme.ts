import { Oswald, Inconsolata } from "next/font/google";
import { createTheme, PaletteColor } from "@mui/material/styles";

export const oswald = Oswald({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

export const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// https://stackoverflow.com/questions/59145165/change-root-background-color-with-material-ui-theme

// Create a theme instance.
const theme = createTheme({
  palette: {
    background: {
      default: "#26333A",
    },
    text: {
      primary: "#ffffff",
    },
    primary: {
      main: "#26333A",
    },
    secondary: {
      main: "#048BA8",
    },
    accent: {
      main: "#93032E",
      contrastText: "#FFF",
      // hover: "#AC0436",
    },
  },
  typography: {
    fontFamily: [inconsolata.style.fontFamily].join(),
    h1: {
      fontFamily: oswald.style.fontFamily,
      fontWeight: 400,
    },
    h2: {
      fontFamily: oswald.style.fontFamily,
      fontWeight: 400,
    },
    h3: {
      fontFamily: oswald.style.fontFamily,
    },
  },
});

// const theme = createTheme({
//   components: {
//     MuiMe,
//   },
// });

export default theme;
