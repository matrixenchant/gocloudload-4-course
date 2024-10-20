import { Navigate, Route, Routes } from 'react-router-dom';

import { useApp } from './hooks/useApp';
import HomePage from './pages/home';
import TaskDetails from './pages/task';
import TasksPage from './pages/tasks';

function App() {
  const { user } = useApp();

  if (user === null)
    return (
      <Routes>
        <Route element={<HomePage />} path="/" />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    );

  return (
    <Routes>
      <Route element={<HomePage />} path="/" />
      <Route element={<TasksPage />} path="/tasks" />
      <Route element={<TaskDetails />} path="/tasks/:id" />
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
