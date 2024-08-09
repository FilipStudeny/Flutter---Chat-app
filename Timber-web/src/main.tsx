// src/main.tsx (or wherever your main entry file is)

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import HomePage from './views/HomePage';
import WelcomePage from './views/RootPge';
import AppLayout from './components/Layout/Layout';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected routes with layout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<HomePage />} />
          {/* Add more routes that should use the layout here */}
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
