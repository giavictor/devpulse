import {
  Search,
  Bell,
  UserCircle,
} from "lucide-react";

export default function Navbar() {
  return (
    <header className="top-navbar">
      <div className="welcome-section">
        <h2>
          Welcome back! <span>👋</span>
        </h2>

        <p>
          Track your GitHub activity and boost your productivity.
        </p>
      </div>

      <div className="navbar-actions">
        {/* Search */}
        <div className="navbar-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search anything..."
          />
        </div>

        {/* Notification */}
        <button
          className="navbar-icon-button"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="notification-dot">3</span>
        </button>

        {/* Profile */}
        <button
          className="profile-button"
        >
          <UserCircle size={30} />

          <span>Darshan</span>
        </button>
      </div>
    </header>
  );
}