import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/client';

export default function RegisterPage() {
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
      await registerUser(email, password);
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <h1>Register</h1>
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </main>
  );
}
