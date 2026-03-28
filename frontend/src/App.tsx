import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { checkSession } from './api/client';
import ProtectedRoute from './components/ProtectedRoute';
import EditorPage from './pages/Editor';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { applyThemeMode, getInitialThemeMode, type ThemeMode } from './theme';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const initialTheme = getInitialThemeMode();
    setThemeMode(initialTheme);
    applyThemeMode(initialTheme);
  }, []);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const handleToggleTheme = () => {
    setThemeMode((current) => (current === 'light' ? 'dark' : 'light'));
  };

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
      <Route
        path="/register"
        element={<RegisterPage themeMode={themeMode} onToggleTheme={handleToggleTheme} />}
      />
      <Route
        path="/login"
        element={<LoginPage onLoggedIn={() => setIsAuthenticated(true)} themeMode={themeMode} onToggleTheme={handleToggleTheme} />}
      />
      <Route
        path="/editor"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            {isAuthenticated ? (
              <EditorPage
                onLogout={() => setIsAuthenticated(false)}
                themeMode={themeMode}
                onToggleTheme={handleToggleTheme}
              />
            ) : null}
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/editor' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/editor' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
