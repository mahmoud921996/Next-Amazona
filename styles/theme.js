import { createTheme } from "@mui/material/styles";

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
    },
  },

  typography: {
    h1: {
      fontSize: "1.6rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
    h2: {
      fontSize: "1.4rem",
      fontWeight: 400,
      margin: "1rem 0",
    },
  },
  palette: {
    primary: {
      main: "#f0c000",
      light: "#f1f5f9",
    },
    secondary: {
      main: "#208080",
    },
  },
});

export default theme;
