import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
  const isViteWebsocketError = (msg: string | null | undefined): boolean => {
    if (!msg) return false;
    const lower = msg.toLowerCase();
    return (
      lower.includes('websocket') ||
      lower.includes('web socket') ||
      lower.includes('connection failed') ||
      lower.includes('vite') ||
      lower.includes('closed without') ||
      lower.includes('ปิดโดยไม่เปิด')
    );
  };

  window.addEventListener('error', (event) => {
    const msg = event.message || (event.error && event.error.message);
    if (isViteWebsocketError(msg)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg = reason ? (reason.message || String(reason)) : '';
    if (isViteWebsocketError(msg)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

