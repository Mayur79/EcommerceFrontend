import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/auth';
import 'antd/dist/reset.css';
import { SearchProvider } from './context/search';
import { CartProvider } from './context/cart';
import { GoogleOAuthProvider } from '@react-oauth/google';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    <SearchProvider>
      <CartProvider>
        <BrowserRouter>
          <GoogleOAuthProvider clientId="616888006246-16s7u3dv74ddl6t4cbenlbsnpe4tmg4p.apps.googleusercontent.com">
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </CartProvider>
    </SearchProvider>
  </AuthProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
