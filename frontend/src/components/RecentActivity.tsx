import type { GithubEvent } from "../types";

import {
  GitCommit,
  GitPullRequest,
  CircleDot,
  FolderPlus,
  MessageSquare,
  GitMerge,
  Activity,
  Star,
} from "lucide-react";

interface RecentActivityProps {
  events: GithubEvent[];
}

export default function RecentActivity({
  events = [],
}: RecentActivityProps) {

  // =========================================
  // GET EVENT TYPE AND ICON
  // =========================================

  const getEventDetails = (event: GithubEvent) => {
    const message = (event.message || "").toLowerCase();

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

    if (message.includes("star")) {
      return {
        icon: Star,
        type: "Star",
        className: "activity-star",
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
      message.includes("repo") ||
      message.includes("created")
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

  // =========================================
  // FORMAT EVENT TIME
  // =========================================

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

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes} min ago`;
    }

    if (hours < 24) {
      return `${hours} hour${
        hours !== 1 ? "s" : ""
      } ago`;
    }

    if (days < 7) {
      return `${days} day${
        days !== 1 ? "s" : ""
      } ago`;
    }

    return eventDate.toLocaleDateString();
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="recent-activity">

      {/* SECTION HEADING */}

      <div className="activity-heading">

        <div>

          <p className="section-label">
            LIVE DEVELOPER EVENTS
          </p>

          <h2>
            Recent Activity
          </h2>

        </div>

        <Activity size={25} />

      </div>

      {/* =====================================
          EMPTY STATE
      ===================================== */}

      {events.length === 0 ? (

        <div className="activity-empty">

          <Activity size={30} />

          <div>

            <h3>
              No activity to display
            </h3>

            <p>
              Search for a GitHub user to view their
              recent developer activity.
            </p>

          </div>

        </div>

      ) : (

        /* =====================================
            ACTIVITY LIST
        ===================================== */

        <div className="activity-list">

          {events.slice(0, 6).map((event) => {

            const details =
              getEventDetails(event);

            const Icon =
              details.icon;

            return (

              <div
                className="activity-item"
                key={event.id}
              >

                {/* EVENT ICON */}

                <div
                  className={
                    `activity-icon ${details.className}`
                  }
                >

                  <Icon size={19} />

                </div>

                {/* EVENT CONTENT */}

                <div className="activity-content">

                  <h3>
                    {event.message}
                  </h3>

                  <p>
                    {formatTime(event.created_at)}
                  </p>

                </div>

                {/* EVENT TYPE */}

                <span
                  className={
                    `activity-badge ${details.className}`
                  }
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