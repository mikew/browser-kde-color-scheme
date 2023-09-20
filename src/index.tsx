import CssBaseline from '@mui/material/CssBaseline/CssBaseline';
import GlobalStyles from '@mui/material/GlobalStyles';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import { SnackbarProvider } from 'notistack';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './app/App';
import theme from './app/theme';

async function main() {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    createRoot(rootElement).render(
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <SnackbarProvider />
          <CssBaseline enableColorScheme />
          {/* <GlobalStyles
            styles={`
html, body, #root {
  height: 100%;
}
            `}
          /> */}

          <App />
        </ThemeProvider>
      </BrowserRouter>
    );
  }
}

main();
