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

// declare module "@mui/material/TextField" {
//   interface TextFieldPropsVariantOverrides {
//     primary: true;
//   }
// }
//stackoverflow.com/questions/59145165/change-root-background-color-with-material-ui-theme

// Create a theme instance.
let theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#1B2429",
    },
    text: {
      primary: "#F2F4F3",
      secondary: "#808080",
    },
    primary: {
      main: "#26333A",
      "100": "#1b2429",
      "200": "#161D21",
      "300": "#00000066",

      contrastText: "#fefefe",
    },
    secondary: {
      main: "#048BA8",
      contrastText: "#fefefe",
    },
    accent: {
      main: "#93032E",
      light: "#4089A5",
      // contrastText: "#FFF",
      // hover: "#AC0436",
      dark: "#58021c",
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
    h4: {
      fontFamily: oswald.style.fontFamily,
    },
    h5: {
      fontFamily: oswald.style.fontFamily,
    },
    h6: {
      fontFamily: oswald.style.fontFamily,
    },
  },
});

theme = createTheme(theme, {
  components: {
    // MuiMenu: {
    //   styleOverrides: {
    //     paper: {
    //       backgroundColor: "palette.primary.main",
    //       color: "red",
    //     },
    //   },
    // },
    MuiAccordion: {
      styleOverrides: {
        root: {
          width: "100%",
          backgroundColor: "transparent",
          border: "2px solid #A3A3A3",
          borderRadius: "4px",
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 36,
          "& .MuiAccordionSummary-content, & .MuiAccordionSummary-content.Mui-expanded":
            {
              margin: 0,
            },
          "&.Mui-expanded": {
            minHeight: 36,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          color: "#fefefe60",
          marginRight: "8px",
          lineHeight: "0.75",
          padding: "0px",
          minHeight: "36px",
          minWidth: "80px",
          "&.Mui-selected": {
            color: "#fefefe",
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: "36px",
          "& .MuiTabs-indicator": {
            backgroundColor: "#fefefe",
          },
        },
      },
    },
    MuiTextField: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#616161",
              },
              "&:hover fieldset": {
                borderColor: "#A8A8A8",
              },
            },
            "& label": {
              color: "grey",
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              "& > fieldset": {
                borderColor: "#D9D9D9",
              },
            },
            "& label.Mui-focused": {
              color: "#D9D9D9",
            },
          },
        },
      ],
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          overflow: "hidden",
          "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
            width: "8px",
            // background-color: #"F5F5F5";
          },
          "&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
            backgroundColor: "#00000020",
            borderRadius: "20px",
            // border: "6px solid transparent",
            backgroundClip: "content-box",
          },
          "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
            {
              backgroundColor: "#ffffff20",
            },
        },
      },
    },
  },
});

export default theme;
