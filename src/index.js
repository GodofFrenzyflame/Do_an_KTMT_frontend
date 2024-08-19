import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng `react-dom/client` thay vì `react-dom`
import App from './App';
import './styles/globalStyles.css';
import { AppProvider } from './AppContext'; // Import AppProvider
import './i18n';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(
  //<React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  //</React.StrictMode>
);
