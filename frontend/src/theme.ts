import { Oswald, Inconsolata } from "next/font/google";
import { createTheme, PaletteColor } from "@mui/material/styles";
import { red } from "@mui/material/colors";

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

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#26333A",
    },
    secondary: {
      main: "#048BA8",
    },
    accent: {
      main: "#93032E",
      contrastText: "#fff",
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

export default theme;
