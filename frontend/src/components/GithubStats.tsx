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

  // Get the top 5 languages
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

      {/* Main Statistics */}
      <div className="stats-cards">

        {/* Repositories */}
        <div className="stat-card">
          <div className="stat-icon repositories-icon">
            <FolderGit2 size={22} />
          </div>

          <div>
            <h3>{totalRepos}</h3>

            <p>Repositories</p>
          </div>
        </div>

        {/* Stars */}
        <div className="stat-card">
          <div className="stat-icon stars-icon">
            <Star size={22} />
          </div>

          <div>
            <h3>{totalStars}</h3>

            <p>Total Stars</p>
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
                    {count} repo{count !== 1 ? "s" : ""}
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