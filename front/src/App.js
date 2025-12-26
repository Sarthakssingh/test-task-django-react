import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import TaskForm from './TaskForm';
import PerformanceView from './PerformanceView';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/me/performance/', { credentials: 'include' })
      .then(r => r.ok ? setIsLoggedIn(true) : setIsLoggedIn(false))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/tasks');
  };

  const handleLogout = async () => {
    await fetch('/auth/logout/', { credentials: 'include' });
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={!isLoggedIn ? <LoginForm onLogin={handleLogin} /> : <Navigate to="/tasks" />} />
        <Route path="/tasks" element={isLoggedIn ? <TaskForm onLogout={handleLogout} /> : <Navigate to="/" />} />
        <Route path="/performance" element={isLoggedIn ? <PerformanceView onLogout={handleLogout} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;

