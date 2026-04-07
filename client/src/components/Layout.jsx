import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1>Expense Tracker</h1>
          <p className="muted">Track income, expenses, and spending trends.</p>
        </div>
        <div className="header__actions">
          <button className="button button--ghost" onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark" : "☀️ Light"}
          </button>
          <span className="pill">{user?.email}</span>
          <Link className="button button--ghost" to="/dashboard">
            Dashboard
          </Link>
          <button className="button" onClick={logout}>
            Logout
          </button>
        </div>
      </header>
      {children}
    </div>
  );
};

export default Layout;
