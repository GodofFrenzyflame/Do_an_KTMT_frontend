import React from 'react';
import ReactDOM from 'react-dom/client'; // Sử dụng `react-dom/client` thay vì `react-dom`
import App from './App';
import './Styles/Styles.css';
import { AppProvider } from '../src/components/ui/Setting/language/AppContext.jsx'; // Import AppProvider
import '../src/components/ui/Setting/language/i18n.jsx';
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const root = ReactDOM.createRoot(document.getElementById('root')); // Tạo root
root.render(

  <AppProvider>
    <App />
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover={false}
      theme="light"
    />
  </AppProvider>

);
