import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { Home } from './components/Home';
import { Register } from './auth-components/Register';
import App from './App';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/Register',
    element: <Register />
  },
  {
    path: '/App',
    element: <App />
  },
  {
    path: '/Home',
    element: <Home />
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster />
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
