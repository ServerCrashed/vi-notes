import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/client';

type LoginPageProps = {
  onLoggedIn: (token: string) => void;
};

export default function LoginPage({ onLoggedIn }: LoginPageProps) {
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
      const response = await loginUser(email, password);
      localStorage.setItem('vi_notes_token', response.token);
      onLoggedIn(response.token);
      navigate('/editor');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
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
  );
}
