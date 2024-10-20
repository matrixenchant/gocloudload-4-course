import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { AppProvider } from './contexts/AppContext.tsx';
import { Provider } from './provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider>
      <AppProvider>
        <Toaster />
        <App />
      </AppProvider>
    </Provider>
  </BrowserRouter>
);
