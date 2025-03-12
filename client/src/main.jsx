import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import PreferencesProvider from './preferences/PreferencesProvider.jsx';

createRoot(document.getElementById('root')).render(
  <PreferencesProvider>
    <App />
  </PreferencesProvider>
);
