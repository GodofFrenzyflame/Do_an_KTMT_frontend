import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng `react-dom/client` thay vì `react-dom`
import App from './App';
import './styles/Styles.css';
import { AppProvider } from '../src/components/ui/Setting/language/AppContext.jsx'; // Import AppProvider
import '../src/components/ui/Setting/language/i18n.jsx';

const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(

    <AppProvider>
      <App />
    </AppProvider>
 
);
