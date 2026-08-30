// frontend/src/services/githubApi.ts
import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export interface GithubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
  created_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
}

// Custom error so components can show a clean message
export class GithubApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
  }
}

function handleError(error: unknown, username: string): never {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      throw new GithubApiError(`User "${username}" not found.`, 404);
    }
    if (error.response?.status === 403) {
      throw new GithubApiError(
        "GitHub API rate limit exceeded. Please try again later.",
        403
      );
    }
    throw new GithubApiError(
      error.response?.data?.message || "Something went wrong while contacting GitHub.",
      error.response?.status
    );
  }
  throw new GithubApiError("Unexpected error occurred.");
}

// 1. Get user profile
export async function getUser(username: string): Promise<GithubUser> {
  try {
    const { data } = await githubApi.get<GithubUser>(`/users/${username}`);
    return data;
  } catch (error) {
    return handleError(error, username);
  }
}

// 2. Get public repos (sorted by most recently updated)
export async function getUserRepos(username: string): Promise<GithubRepo[]> {
  try {
    const { data } = await githubApi.get<GithubRepo[]>(`/users/${username}/repos`, {
      params: { sort: "updated", per_page: 100 },
    });
    return data;
  } catch (error) {
    return handleError(error, username);
  }
}

// 3. Get recent public activity/events
export async function getUserEvents(username: string): Promise<GithubEvent[]> {
  try {
    const { data } = await githubApi.get<GithubEvent[]>(
      `/users/${username}/events/public`,
      { params: { per_page: 10 } }
    );
    return data;
  } catch (error) {
    return handleError(error, username);
  }
}

// 4. Convenience: fetch everything at once for the search flow

export async function getGithubDashboardData(username: string) {
  const [user, repos, events] = await Promise.all([
    getUser(username),
    getUserRepos(username),
    getUserEvents(username),
  ]);

  const totalRepos = repos.length;

  const totalStars = repos.reduce(
    (sum, r) => sum + r.stargazers_count,
    0
  );

  const languageCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] =
        (languageCounts[repo.language] || 0) + 1;
    }
  });

  return {
    user,
    repos,
    events,
    totalRepos,
    totalStars,
    languageCounts,
  };
}