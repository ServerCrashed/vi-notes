import { Link } from 'react-router-dom';
import type { ThemeMode } from '../theme';

type HeaderProps = {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
};

export default function Header({ themeMode, onToggleTheme }: HeaderProps) {
  const nextThemeLabel = themeMode === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <header className="app-header">
      <Link to="/login" className="app-header-title">Vi-Notes</Link>
      <button
        type="button"
        className="theme-toggle-btn"
        onClick={onToggleTheme}
        aria-label={nextThemeLabel}
        title={nextThemeLabel}
      >
        {themeMode === 'light' ? (
          <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M9.37 5.51A7 7 0 0 0 18.5 14.63 8 8 0 1 1 9.37 5.51Z"
            />
          </svg>
        ) : (
          <svg className="theme-toggle-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 4a1 1 0 0 1 1 1v1.2a1 1 0 1 1-2 0V5a1 1 0 0 1 1-1Zm0 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm8-4a1 1 0 0 1-1 1h-1.2a1 1 0 1 1 0-2H19a1 1 0 0 1 1 1ZM7.2 12a1 1 0 0 1-1 1H5a1 1 0 1 1 0-2h1.2a1 1 0 0 1 1 1Zm9.05 4.95a1 1 0 0 1 1.41 0l.85.85a1 1 0 0 1-1.41 1.41l-.85-.85a1 1 0 0 1 0-1.41ZM5.5 6.91A1 1 0 0 1 6.91 5.5l.85.85a1 1 0 1 1-1.41 1.41l-.85-.85ZM12 17.8a1 1 0 0 1 1 1V20a1 1 0 1 1-2 0v-1.2a1 1 0 0 1 1-1Zm-5.09-.85a1 1 0 0 1 0 1.41l-.85.85a1 1 0 0 1-1.41-1.41l.85-.85a1 1 0 0 1 1.41 0Zm11.6-11.6a1 1 0 0 1 0 1.41l-.85.85a1 1 0 1 1-1.41-1.41l.85-.85a1 1 0 0 1 1.41 0Z"
            />
          </svg>
        )}
      </button>
    </header>
  );
}