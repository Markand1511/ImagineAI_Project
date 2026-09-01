import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { GeneratePage } from './pages/Generate';
import { MyGenerationsPage } from './pages/MyGenerations';
import { ImageDetailPage } from './pages/ImageDetail';
import { ToastProvider } from './context/ToastContext';
import { Toaster } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<GeneratePage />} />
          <Route path="generations" element={<MyGenerationsPage />} />
          <Route path="generations/:id" element={<ImageDetailPage />} />
        </Route>
      </Routes>
      <Toaster />
    </ToastProvider>
  );
}

export default App;