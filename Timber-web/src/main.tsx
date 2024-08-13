// src/main.tsx (or wherever your main entry file is)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { RouterProvider } from 'react-router-dom';
import routes from './routes/routes';
import { AuthenticationProvider } from './context/AuthenticationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AuthenticationProvider>
        <RouterProvider router={routes}/>
      </AuthenticationProvider>
  </React.StrictMode>
);