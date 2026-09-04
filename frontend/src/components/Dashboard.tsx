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
    <section className="space-y-4 sm:space-y-6">

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold break-words">
          DevPulse Dashboard
        </h1>

        <p className="mt-1 text-sm sm:text-base text-gray-600">
          Track your GitHub activity and developer resources.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

        <div className="min-w-0 bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <GithubStats repos={repos} />
        </div>

        <div className="min-w-0 bg-white border rounded-lg p-4 sm:p-6 shadow-sm">
          <RecentActivity events={events} />
        </div>

      </div>

    </section>
  );
}