import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';      // ✅ import Provider           // ✅ import your Redux store
import App from './App';
import './index.css';
import { store } from './app/store';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const enableGoogleOnLocalhost = import.meta.env.VITE_ENABLE_GOOGLE_LOCALHOST === 'true';
const shouldEnableGoogle = Boolean(googleClientId) && (!isLocalhost || enableGoogleOnLocalhost);

// Initialize Lenis
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
  infinite: false,
  prevent: (node) => node?.closest?.('[data-lenis-prevent]') !== null,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    {shouldEnableGoogle ? (
      <GoogleOAuthProvider clientId={googleClientId}>
        <Provider store={store}>
          <App />
        </Provider>
      </GoogleOAuthProvider>
    ) : (
      <Provider store={store}>
        <App />
      </Provider>
    )}
  </BrowserRouter>
);
