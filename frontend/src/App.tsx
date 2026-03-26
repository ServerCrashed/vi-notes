import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import EditorPage from './pages/Editor';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';

function App() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('vi_notes_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <Routes>
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage onLoggedIn={setToken} />} />
      <Route
        path="/editor"
        element={
          <ProtectedRoute token={token}>
            {token ? <EditorPage token={token} onLogout={() => setToken(null)} /> : null}
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to={token ? '/editor' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={token ? '/editor' : '/login'} replace />} />
    </Routes>
  );
}

export default App;
