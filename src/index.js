import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa createRoot
import App from './App';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Cria a raiz para renderizar o React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
