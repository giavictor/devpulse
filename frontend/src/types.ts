// ===============================
// GitHub User
// ===============================

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


// ===============================
// GitHub Repository
// ===============================

export interface GithubRepo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
}


// ===============================
// GitHub Event
// ===============================
export interface GithubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
  };
  created_at: string;
  message: string;
}

// ===============================
// Saved Link
// ===============================

export interface SavedLink {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}


// ===============================
// Note
// ===============================

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}


// ===============================
// GitHub Dashboard Data
// ===============================

export interface GithubDashboardData {
  user: GithubUser;
  repos: GithubRepo[];
  events: GithubEvent[];
  totalRepos: number;
  totalStars: number;
  languageCounts: Record<string, number>;
}