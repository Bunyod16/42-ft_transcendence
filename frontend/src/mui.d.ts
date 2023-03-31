// import "@material-ui/core/styles/createPallete";

// declare module "@material-ui/core/styles/createPallete" {
//   interface Palette {
//     myCustomColor?: Palette["primary"];
//   }
//   interface PaletteOptions {
//     myCustomColor?: PaletteOptions["primary"];
//   }
// }

import "@mui/material/styles/createPalette";
import "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface PaletteOptions {
    accent?: PaletteColorOptions;
  }

  interface Palette {
    accent?: PaletteColor;
  }
}

declare module "@mui/material" {
  interface ButtonPropsColorOverrides {
    accent;
  }
}
