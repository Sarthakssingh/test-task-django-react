import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import TaskForm from './TaskForm';
import PerformanceView from './PerformanceView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/performance/', { credentials: 'include' })
      .then(r => r.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/api/tasks');
  };

  const handleLogout = async () => {
    const getCsrfToken = () => {
      return document.cookie.split('; ').find(row => row.startsWith('csrftoken'))
      ?.split('=')[1];
    };
    await fetch('/api/logout/', { credentials: 'include' });
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/api" element={!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <Navigate to="/api/tasks" />} />
        <Route path="/api/tasks" element={isLoggedIn ? <TaskForm onLogout={handleLogout} /> : <Navigate to="/api/" />} />
        <Route path="/api/performance" element={isLoggedIn ? <PerformanceView onLogout={handleLogout} /> : <Navigate to="/api/" />} />
      </Routes>
    </div>
  );
}

export default App;

