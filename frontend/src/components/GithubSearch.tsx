import { useState } from "react";

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
} from "../services/githubApi";

interface GithubSearchProps {
  onReposLoaded: (repos: GithubRepo[]) => void;
  onEventsLoaded: (events: GithubEvent[]) => void;
}

export default function GithubSearch({
  onReposLoaded,
  onEventsLoaded,
}: GithubSearchProps) {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GithubUser | null>(null);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Error state
  const [error, setError] = useState("");

  // Checks whether a search has been made
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    const trimmedUsername = username.trim();

    // Check empty input
    if (!trimmedUsername) {
      setError("Please enter a GitHub username.");
      setHasSearched(true);
      return;
    }

    // Start loading
    setLoading(true);
    setHasSearched(true);

    // Clear previous data
    setError("");
    setUser(null);
    onReposLoaded([]);
    onEventsLoaded([]);

    try {
      // Get GitHub user
      const data = await getUser(trimmedUsername);

      // Get repositories
      const repos = await getUserRepos(trimmedUsername);

      // Get recent events
      const events = await getUserEvents(trimmedUsername);

      // Save results
      setUser(data);
      onReposLoaded(repos);
      onEventsLoaded(events);
    } catch (err) {
      if (err instanceof GithubApiError) {
        setError(err.message);
      } else {
        setError(
          "Unable to connect to GitHub. Please check your internet connection and try again."
        );
      }
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>GitHub Search</h2>

      {/* Controlled input */}
      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* Search button */}
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {/* Empty / initial state */}
      {!hasSearched && !loading && (
        <div>
          <p>
            👋 Enter a GitHub username to view their profile,
            repositories, stats, and recent activity.
          </p>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div>
          <p>⏳ Loading GitHub data...</p>

          <div
            style={{
              width: "30px",
              height: "30px",
              border: "4px solid #ddd",
              borderTop: "4px solid #333",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div>
          <p>❌ {error}</p>
        </div>
      )}

      {/* Results state */}
      {!loading && !error && user && (
        <div>
          <img
            src={user.avatar_url}
            alt={user.login}
            width={100}
          />

          <h3>{user.name || user.login}</h3>

          <p>
            {user.bio || "No bio available."}
          </p>

          <p>
            Public Repositories: {user.public_repos}
          </p>

          <p>
            Followers: {user.followers}
          </p>

          <p>
            Following: {user.following}
          </p>
        </div>
      )}

      {/* Spinner animation */}
      <style>
        {`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}