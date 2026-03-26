import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="app-header">
      <Link to="/login" className="app-header-title">Vi-Notes</Link>
    </header>
  );
}