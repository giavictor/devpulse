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

// Task 3: Clear state management
const [status, setStatus] = useState<SearchStatus>("idle");

// Error message
const [error, setError] = useState("");

const handleSearch = async () => {
const trimmedUsername = username.trim();

// Empty input validation
if (!trimmedUsername) {
  setError("Please enter a GitHub username.");
  setStatus("error");
  return;
}

// Start loading
setStatus("loading");
setError("");

// Clear previous data
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

  // Success state
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

  // Error state
  setStatus("error");
}


};

return ( <div> <h2>GitHub Search</h2>

```
  {/* Controlled input */}
  <input
    type="text"
    placeholder="Enter GitHub username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    }}
  />

  {/* Search button */}
  <button
    onClick={handleSearch}
    disabled={status === "loading"}
  >
    {status === "loading" ? "Searching..." : "Search"}
  </button>

  {/* IDLE / EMPTY STATE */}
  {status === "idle" && (
    <div>
      <p>
        👋 Enter a GitHub username to view their profile,
        repositories, stats, and recent activity.
      </p>
    </div>
  )}

  {/* LOADING STATE */}
  {status === "loading" && (
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

  {/* ERROR STATE */}
  {status === "error" && (
    <div>
      <p>❌ {error}</p>

      <button
        onClick={handleSearch}
        disabled={status === "loading"}
      >
        Try Again
      </button>
    </div>
  )}

  {/* SUCCESS STATE */}
  {status === "success" && user && (
    <div>
      <p>✅ GitHub profile loaded successfully!</p>

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
