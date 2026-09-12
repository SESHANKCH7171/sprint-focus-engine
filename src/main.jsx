import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');
if (root) {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    );
  } catch (err) {
    console.error('Application mount error:', err);
    root.innerHTML = `
      <div style="background:#0a0a0a;color:#fff;padding:24px;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:sans-serif;text-align:center;">
        <h2 style="color:#f59e0b;font-size:20px;margin-bottom:12px;">App Refreshing...</h2>
        <p style="color:#a3a3a3;font-size:14px;margin-bottom:20px;">Updating to latest version.</p>
        <button onclick="localStorage.clear();location.reload();" style="background:#f59e0b;color:#000;border:none;padding:12px 24px;border-radius:12px;font-weight:bold;cursor:pointer;">
          Reload Now
        </button>
      </div>
    `;
  }
}
