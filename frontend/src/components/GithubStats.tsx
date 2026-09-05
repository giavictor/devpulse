import type { GithubRepo } from "../types";

import {
  FolderGit2,
  Star,
  Code2,
} from "lucide-react";

interface GithubStatsProps {
  repos: GithubRepo[];
}

export default function GithubStats({
  repos = [],
}: GithubStatsProps) {
  // Total repositories
  const totalRepos = repos.length;

  // Total stars
  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // Count programming languages
  const languageCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] =
        (languageCounts[repo.language] || 0) + 1;
    }
  });

  // Get top 5 languages
  const mostUsedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="github-stats">

      {/* Section Heading */}
      <div className="stats-heading">
        <div>
          <p className="section-label">
            GITHUB ANALYTICS
          </p>

          <h2>GitHub Stats</h2>
        </div>

        <Code2 size={25} />
      </div>

      {/* Statistics Cards */}
      <div className="stats-cards">

        {/* Repositories */}
        <div className="stat-card graph-card">
          <div className="stat-card-top">

            <div className="stat-icon repositories-icon">
              <FolderGit2 size={22} />
            </div>

            <span className="stat-label">
              REPOSITORIES
            </span>

          </div>

          <div className="stat-number">
            {totalRepos}
          </div>

          <p className="stat-description">
            Total Repositories
          </p>

          {/* Repository Graph */}
          <div className="stat-graph repositories-graph">
            <svg
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              aria-label="Repository statistics graph"
            >
              <polyline
                points="
                  0,65
                  20,55
                  40,60
                  60,35
                  80,48
                  100,28
                  120,42
                  140,20
                  160,38
                  180,30
                  200,48
                  220,32
                  240,25
                  260,40
                  280,18
                  300,25
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="300" cy="25" r="4" />
            </svg>
          </div>
        </div>

        {/* Stars */}
        <div className="stat-card graph-card">
          <div className="stat-card-top">

            <div className="stat-icon stars-icon">
              <Star size={22} />
            </div>

            <span className="stat-label">
              TOTAL STARS
            </span>

          </div>

          <div className="stat-number">
            {totalStars}
          </div>

          <p className="stat-description">
            Stars Across All Repositories
          </p>

          {/* Stars Graph */}
          <div className="stat-graph stars-graph">
            <svg
              viewBox="0 0 300 80"
              preserveAspectRatio="none"
              aria-label="Stars statistics graph"
            >
              <polyline
                points="
                  0,70
                  20,62
                  40,66
                  60,48
                  80,55
                  100,38
                  120,45
                  140,30
                  160,40
                  180,22
                  200,35
                  220,18
                  240,28
                  260,12
                  280,22
                  300,8
                "
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <circle cx="300" cy="8" r="4" />
            </svg>
          </div>
        </div>

      </div>

      {/* Languages */}
      <div className="languages-section">

        <div className="languages-heading">
          <Code2 size={18} />

          <h3>Most Used Languages</h3>
        </div>

        {mostUsedLanguages.length > 0 ? (
          <div className="languages-list">

            {mostUsedLanguages.map(
              ([language, count]) => (
                <div
                  className="language-item"
                  key={language}
                >
                  <div className="language-name">
                    <span className="language-dot"></span>

                    <span>{language}</span>
                  </div>

                  <span className="language-count">
                    {count} repo
                    {count !== 1 ? "s" : ""}
                  </span>
                </div>
              )
            )}

          </div>
        ) : (
          <div className="empty-languages">

            <Code2 size={24} />

            <p>
              Search for a GitHub user to see their
              programming languages.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}