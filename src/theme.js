import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#006a28',
    },
    secondary: {
      main: '#006a28',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  breakpoints: {
    values: {
      xs: 0,    // para celulares pequenos
      sm: 600,  // celulares maiores
      md: 960,  // tablets
      lg: 1280, // laptops
      xl: 1920, // monitores grandes
    },
  },
});

export default theme;
