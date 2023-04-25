import { Inconsolata, Oswald } from "next/font/google";
import { createTheme } from "@mui/material/styles";

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
      secondary: "#808080",
    },
    primary: {
      main: "#26333A",
      "100": "#1b2429",
      "200": "rgba(0,0,0,0.2)",
    },
    secondary: {
      main: "#048BA8",
    },
    accent: {
      main: "#93032E",
      light: "#4089A5",
      // contrastText: "#FFF",
      // hover: "#AC0436",
      dark:"#58021c"
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
  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "palette.primary.main",
          color: "red",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "20px",
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#d6dee1",
            borderRadius: "20px",
            border: "6px solid transparent",
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#a8bbbf",
            },
        },
      },
    },
  },
});

export default theme;
