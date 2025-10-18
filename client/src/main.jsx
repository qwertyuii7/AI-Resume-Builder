import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';      // ✅ import Provider           // ✅ import your Redux store
import App from './App';
import './index.css';
import { store } from './app/store';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Provider store={store}>                 {/* ✅ wrap everything inside Provider */}
      <App />
    </Provider>
  </BrowserRouter>
);
