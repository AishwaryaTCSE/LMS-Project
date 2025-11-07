// App.jsx
import React, { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '../frontend/src/context/AuthContext';
import { ThemeProvider } from '../frontend/src/context/ThemeContext';
import { NotificationProvider } from '../frontend/src/context/NotificationContext';
import AppRouter from '../frontend/src/router/AppRouter';

// Loading component for Suspense fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading application...</p>
    </div>
  </div>
);

function App() {
  return (
    <React.StrictMode>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <BrowserRouter>
              <Suspense fallback={<LoadingFallback />}>
                <AppRouter />
              </Suspense>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </BrowserRouter>
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}

export default App;
