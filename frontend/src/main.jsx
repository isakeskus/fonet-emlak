import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './styles.css';
import App from './App.jsx';
import { AlertProvider } from './context/AlertContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
      <AlertProvider>
        <App />
      </AlertProvider>
    </HashRouter>
  </React.StrictMode>
);
