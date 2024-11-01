import { Navigate, Route, Routes } from 'react-router-dom';

import CreatePage from './pages/Create';
import DetailsPage from './pages/Details';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';

function App() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />

      <Route element={<HomePage />} path="/" />
      <Route element={<DetailsPage />} path="/:id" />
      <Route element={<CreatePage />} path="/create" />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
