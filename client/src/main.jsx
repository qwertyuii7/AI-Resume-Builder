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
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Provider store={store}>                 {/* ✅ wrap everything inside Provider */}
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
