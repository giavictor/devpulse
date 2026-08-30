import { useState } from "react";

import {
  getUser,
  getUserRepos,
  GithubApiError,
} from "../services/githubApi";

import type {
  GithubUser,
  GithubRepo,
} from "../services/githubApi";

interface GithubSearchProps {
  onReposLoaded: (repos: GithubRepo[]) => void;
}

export default function GithubSearch({
  onReposLoaded,
}: GithubSearchProps) {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!username.trim()) {
      setError("Please enter a GitHub username.");
      return;
    }

    setLoading(true);
    setError("");
    setUser(null);
    onReposLoaded([]);

    try {
      const data = await getUser(username.trim());
      const repos = await getUserRepos(username.trim());

      setUser(data);
      onReposLoaded(repos);
    } catch (err) {
      if (err instanceof GithubApiError) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>GitHub Search</h2>

      <input
        type="text"
        placeholder="Enter GitHub username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p>{error}</p>}

      {user && (
        <div>
          <img
            src={user.avatar_url}
            alt={user.login}
            width={100}
          />

          <h3>{user.name || user.login}</h3>

          <p>{user.bio || "No bio available."}</p>

          <p>Public Repositories: {user.public_repos}</p>

          <p>Followers: {user.followers}</p>

          <p>Following: {user.following}</p>
        </div>
      )}
    </div>
  );
}