import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { checkSession } from './api/client';
import ProtectedRoute from './components/ProtectedRoute';
import EditorPage from './pages/Editor';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    let isMounted = true;

    checkSession()
      .then(() => {
        if (isMounted) {
          setIsAuthenticated(true);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingSession) {
    return null;
  }

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage onLoggedIn={() => setIsAuthenticated(true)} />} />
      <Route
        path="/editor"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            {isAuthenticated ? <EditorPage onLogout={() => setIsAuthenticated(false)} /> : null}
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/editor' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/editor' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
