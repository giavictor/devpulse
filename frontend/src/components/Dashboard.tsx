import type {
  GithubRepo,
  GithubEvent,
} from "../types";

import GithubStats from "./GithubStats";
import RecentActivity from "./RecentActivity";

interface DashboardProps {
  repos: GithubRepo[];
  events: GithubEvent[];
}

export default function Dashboard({
  repos,
  events,
}: DashboardProps) {
  return (
    <section className="dashboard-section">

      {/* Dashboard Heading */}
      <div className="dashboard-heading">
        <div>
          <p className="section-label">
            DEVELOPER OVERVIEW
          </p>

          <h1>DevPulse Dashboard</h1>

          <p className="dashboard-description">
            Track your GitHub statistics, programming languages,
            and recent developer activity.
          </p>
        </div>

        <div className="dashboard-status">
          <span className="status-dot"></span>
          Ready
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="dashboard-grid">

        {/* GitHub Statistics */}
        <div className="dashboard-card">
          <GithubStats repos={repos} />
        </div>

        {/* Recent Activity */}
        <div className="dashboard-card">
          <RecentActivity events={events} />
        </div>

      </div>

    </section>
  );
}