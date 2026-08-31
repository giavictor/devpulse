import axios from "axios";

const githubApi = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

// GitHub user profile
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

// GitHub repository
export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}

// GitHub event
export interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  message: string;
}

// Custom error
export class GithubApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "GithubApiError";
    this.status = status;
  }
}

// Handle GitHub API errors
function handleError(error: unknown, username: string): never {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) {
      throw new GithubApiError(
        `User "${username}" not found.`,
        404
      );
    }

    if (error.response?.status === 403) {
      throw new GithubApiError(
        "GitHub API rate limit exceeded. Please try again later.",
        403
      );
    }

    throw new GithubApiError(
      error.response?.data?.message ||
        "Something went wrong while contacting GitHub.",
      error.response?.status
    );
  }

  throw new GithubApiError("Unexpected error occurred.");
}

// 1. Get GitHub user profile
export async function getUser(
  username: string
): Promise<GithubUser> {
  try {
    const { data } = await githubApi.get<GithubUser>(
      `/users/${username}`
    );

    return data;
  } catch (error) {
    return handleError(error, username);
  }
}

// 2. Get public repositories
export async function getUserRepos(
  username: string
): Promise<GithubRepo[]> {
  try {
    const { data } = await githubApi.get<GithubRepo[]>(
      `/users/${username}/repos`,
      {
        params: {
          sort: "updated",
          per_page: 100,
        },
      }
    );

    return data;
  } catch (error) {
    return handleError(error, username);
  }
}

// 3. Get recent public activity
export async function getUserEvents(
  username: string
): Promise<GithubEvent[]> {
  try {
    const { data } = await githubApi.get<any[]>(
      `/users/${username}/events/public`,
      {
        params: {
          per_page: 10,
        },
      }
    );

    return data.map((event) => {
      let message: string;

      switch (event.type) {
        case "PushEvent":
          message = `pushed to ${event.repo.name}`;
          break;

        case "WatchEvent":
          message = `starred ${event.repo.name}`;
          break;

        case "ForkEvent":
          message = `forked ${event.repo.name}`;
          break;

        case "IssuesEvent":
          message = `updated an issue in ${event.repo.name}`;
          break;

        case "PullRequestEvent":
          message = `updated a pull request in ${event.repo.name}`;
          break;

        case "CreateEvent":
          message = `created something in ${event.repo.name}`;
          break;

        default:
          message = `${event.type.replace("Event", "")} ${event.repo.name}`;
      }

      return {
        id: event.id,
        type: event.type,
        repo: {
          name: event.repo.name,
        },
        created_at: event.created_at,
        message,
      };
    });
  } catch (error) {
    return handleError(error, username);
  }
}

// 4. Get complete dashboard data
export async function getGithubDashboardData(
  username: string
) {
  const [user, repos, events] = await Promise.all([
    getUser(username),
    getUserRepos(username),
    getUserEvents(username),
  ]);

  // Total repositories
  const totalRepos = repos.length;

  // Total stars
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // Most-used languages
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