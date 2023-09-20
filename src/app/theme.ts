import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  palette: {
    background: {
      default: grey[50],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // There's no need for buttons to yell at everyone.
          textTransform: 'initial',
        },
      },
    },
  },
});

export default theme;
