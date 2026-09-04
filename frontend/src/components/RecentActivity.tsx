import type { GithubEvent } from "../types";

interface RecentActivityProps {
  events: GithubEvent[];
}

export default function RecentActivity({
  events,
}: RecentActivityProps) {
  return (
    <div>
      <h2>Recent Activity</h2>

      {events.length === 0 ? (
        <p>No recent activity available.</p>
      ) : (
        <ul>
          {events.map((event) => (
            <li key={event.id}>
              <strong>{event.message}</strong>
              <br />
              <small>
                {new Date(event.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}