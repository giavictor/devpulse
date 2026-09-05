import type { GithubEvent } from "../types";

import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  FolderPlus,
  MessageSquare,
  GitMerge,
  Activity,
} from "lucide-react";

interface RecentActivityProps {
  events: GithubEvent[];
}

export default function RecentActivity({
  events = [],
}: RecentActivityProps) {
  const getEventDetails = (event: GithubEvent) => {
    const message = event.message.toLowerCase();

    if (message.includes("push")) {
      return {
        icon: GitCommit,
        type: "Push",
        className: "activity-push",
      };
    }

    if (
      message.includes("pull request") &&
      message.includes("merge")
    ) {
      return {
        icon: GitMerge,
        type: "Merge",
        className: "activity-merge",
      };
    }

    if (message.includes("pull request")) {
      return {
        icon: GitPullRequest,
        type: "Pull Request",
        className: "activity-pr",
      };
    }

    if (message.includes("issue")) {
      return {
        icon: CircleDot,
        type: "Issue",
        className: "activity-issue",
      };
    }

    if (message.includes("comment")) {
      return {
        icon: MessageSquare,
        type: "Comment",
        className: "activity-comment",
      };
    }

    if (
      message.includes("repository") ||
      message.includes("repo")
    ) {
      return {
        icon: FolderPlus,
        type: "Repository",
        className: "activity-repository",
      };
    }

    return {
      icon: Activity,
      type: "Activity",
      className: "activity-default",
    };
  };

  const formatTime = (dateString: string) => {
    const eventDate = new Date(dateString);
    const now = new Date();

    const difference =
      now.getTime() - eventDate.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    const hours = Math.floor(
      difference / (1000 * 60 * 60)
    );

    const days = Math.floor(
      difference / (1000 * 60 * 60 * 24)
    );

    if (minutes < 60) {
      return `${Math.max(minutes, 1)} min ago`;
    }

    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }

    if (days < 7) {
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return eventDate.toLocaleDateString();
  };

  return (
    <div className="recent-activity">

      {/* Heading */}
      <div className="activity-heading">
        <div>
          <p className="section-label">
            LIVE DEVELOPER EVENTS
          </p>

          <h2>Recent Activity</h2>
        </div>

        <Activity size={25} />
      </div>

      {/* Empty State */}
      {events.length === 0 ? (
        <div className="activity-empty">
          <Activity size={30} />

          <p>
            Search for a GitHub user to view their
            recent activity.
          </p>
        </div>
      ) : (
        <div className="activity-list">
          {events.slice(0, 6).map((event) => {
            const details = getEventDetails(event);
            const Icon = details.icon;

            return (
              <div
                className="activity-item"
                key={event.id}
              >
                <div
                  className={`activity-icon ${details.className}`}
                >
                  <Icon size={19} />
                </div>

                <div className="activity-content">
                  <h3>{event.message}</h3>

                  <p>
                    {formatTime(event.created_at)}
                  </p>
                </div>

                <span
                  className={`activity-badge ${details.className}`}
                >
                  {details.type}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}