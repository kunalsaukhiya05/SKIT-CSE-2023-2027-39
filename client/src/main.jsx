import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './index.css'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import App from './App.jsx'
import { Provider } from 'react-redux';
import store from './store/store.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter>
          <App />
          <Toaster position="top-center" reverseOrder={false} />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
