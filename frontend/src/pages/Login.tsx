import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { checkSession, loginUser } from '../api/client';
import Header from '../components/Header';
import type { ThemeMode } from '../theme';

type LoginPageProps = {
  onLoggedIn: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

export default function LoginPage({ onLoggedIn, themeMode, onToggleTheme }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginUser(email, password);
      await checkSession();
      onLoggedIn();
      navigate('/editor');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(
        message.includes('Unauthorized')
          ? 'Login succeeded but session cookie was not accepted. Check CORS_ORIGIN and ensure you are using an allowed frontend URL.'
          : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header themeMode={themeMode} onToggleTheme={onToggleTheme} />
      <main className="auth-page">
        <h1>Login</h1>
    <form onSubmit={onSubmit}>
    <div className="auth-form-row">
        <label htmlFor="email" className="auth-form-label">Email:</label>
        <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className="auth-form-input"
        />
    </div>

    <div className="auth-form-row">
        <label htmlFor="password" className="auth-form-label">Password:</label>
        <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
        className="auth-form-input"
        />
    </div>

    {error && <p className="auth-error">{error}</p>}

    <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Signing in...' : 'Login'}
    </button>
    </form>

    <p>
    Need an account? <Link to="/register">Register</Link>
    </p>
      </main>
    </>
  );
}
