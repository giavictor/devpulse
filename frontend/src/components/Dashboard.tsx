import type { GithubRepo, GithubEvent } from "../types";
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
    <div>
      <h1>DevPulse Dashboard</h1>

      <GithubStats repos={repos} />

      <RecentActivity events={events} />
    </div>
  );
}