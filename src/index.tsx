import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { GlobalStyle } from '@styled';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <GlobalStyle />
      <App />
    </StrictMode>
  );
}
