import { useState } from "react";

import {
  Search,
  Users,
  UserPlus,
  BookOpen,
  Loader2,
  AlertCircle,
  Code2,
} from "lucide-react";

import {
  getUser,
  getUserRepos,
  getUserEvents,
  GithubApiError,
} from "../services/githubApi";

import type {
  GithubUser,
  GithubRepo,
  GithubEvent,
} from "../types";

interface GithubSearchProps {
  onReposLoaded: (repos: GithubRepo[]) => void;
  onEventsLoaded: (events: GithubEvent[]) => void;
}

type SearchStatus = "idle" | "loading" | "success" | "error";

export default function GithubSearch({
  onReposLoaded,
  onEventsLoaded,
}: GithubSearchProps) {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmedUsername = username.trim();

    // Check if input is empty
    if (!trimmedUsername) {
      setError("Please enter a GitHub username.");
      setStatus("error");
      return;
    }

    // Start loading
    setStatus("loading");
    setError("");
    setUser(null);

    // Clear previous dashboard data
    onReposLoaded([]);
    onEventsLoaded([]);

    try {
      // Fetch user and repositories
      const data = await getUser(trimmedUsername);
      const repos = await getUserRepos(trimmedUsername);

      // IMPORTANT:
      // This matches your existing githubApi.ts
      const events = await getUserEvents(trimmedUsername);

      // Update data
      setUser(data);
      onReposLoaded(repos);
      onEventsLoaded(events);

      setStatus("success");
    } catch (err) {
      if (err instanceof GithubApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to connect to GitHub. Please check your internet connection and try again."
        );
      }

      setStatus("error");
    }
  };

  return (
    <section className="github-search-section">
      {/* Heading */}
      <div className="search-heading">
        <div>
          <p className="section-label">
            DEVELOPER INTELLIGENCE
          </p>

          <h2>Explore GitHub Profiles</h2>

          <p className="section-description">
            Search any developer and explore their repositories,
            activity, and developer statistics.
          </p>
        </div>

        <Code2
          size={38}
          className="github-main-icon"
        />
      </div>

      {/* Search Bar */}
      <div className="github-search-bar">
        <Search size={20} />

        <input
          type="text"
          placeholder="Enter GitHub username..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        <button
          onClick={handleSearch}
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <>
              <Loader2
                size={18}
                className="spin-icon"
              />
              Searching...
            </>
          ) : (
            <>
              <Search size={18} />
              Search
            </>
          )}
        </button>
      </div>

      {/* Idle State */}
      {status === "idle" && (
        <div className="search-idle-state">
          <Code2 size={30} />

          <div>
            <h3>Ready to explore?</h3>

            <p>
              Enter a GitHub username to view repositories,
              stars, languages, and recent activity.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {status === "loading" && (
        <div className="search-loading-state">
          <Loader2
            size={30}
            className="spin-icon"
          />

          <p>
            Fetching GitHub profile and repository data...
          </p>
        </div>
      )}

      {/* Error State */}
      {status === "error" && (
        <div className="search-error-state">
          <AlertCircle size={24} />

          <div>
            <h3>Something went wrong</h3>

            <p>{error}</p>
          </div>

          <button onClick={handleSearch}>
            Try Again
          </button>
        </div>
      )}

      {/* Success State */}
      {status === "success" && user && (
        <div className="github-profile-card">

          {/* Profile Information */}
          <div className="profile-main-info">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="github-avatar"
            />

            <div>
              <p className="profile-label">
                GITHUB PROFILE
              </p>

              <h3>
                {user.name || user.login}
              </h3>

              <p className="github-username">
                @{user.login}
              </p>

              <p className="github-bio">
                {user.bio || "No bio available."}
              </p>
            </div>
          </div>

          {/* Profile Statistics */}
          <div className="profile-stats">

            {/* Repositories */}
            <div className="profile-stat">
              <BookOpen size={20} />

              <div>
                <strong>
                  {user.public_repos}
                </strong>

                <span>
                  Repositories
                </span>
              </div>
            </div>

            {/* Followers */}
            <div className="profile-stat">
              <Users size={20} />

              <div>
                <strong>
                  {user.followers}
                </strong>

                <span>
                  Followers
                </span>
              </div>
            </div>

            {/* Following */}
            <div className="profile-stat">
              <UserPlus size={20} />

              <div>
                <strong>
                  {user.following}
                </strong>

                <span>
                  Following
                </span>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}