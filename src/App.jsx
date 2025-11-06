// App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../frontend/src/context/AuthContext.jsx';
import { ThemeProvider } from '../frontend/src/context/ThemeContext';
import AppRouter from '../frontend/src/router/AppRouter';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
