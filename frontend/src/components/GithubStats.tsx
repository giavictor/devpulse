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

  // =========================================
  // TOTAL REPOSITORIES
  // =========================================

  const totalRepos = repos.length;

  // =========================================
  // TOTAL STARS
  // =========================================

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // =========================================
  // PROGRAMMING LANGUAGES
  // =========================================

  const languageCounts: Record<string, number> = {};

  repos.forEach((repo) => {
    if (repo.language) {
      languageCounts[repo.language] =
        (languageCounts[repo.language] || 0) + 1;
    }
  });

  const mostUsedLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // =========================================
  // CHECK IF USER HAS BEEN SEARCHED
  // =========================================

  const hasData = repos.length > 0;

  return (
    <div className="github-stats">

      {/* SECTION HEADING */}

      <div className="stats-heading">
        <div>
          <p className="section-label">
            GITHUB ANALYTICS
          </p>

          <h2>GitHub Stats</h2>
        </div>

        <Code2 size={25} />
      </div>

      {/* STATISTICS CARDS */}

      <div className="stats-cards">

        {/* =====================================
            REPOSITORIES CARD
        ===================================== */}

        <div
          className={`stat-card ${
            hasData ? "graph-card" : ""
          }`}
        >

          <div className="stat-card-top">

            <div className="stat-icon repositories-icon">
              <FolderGit2 size={22} />
            </div>

            <span className="stat-label">
              REPOSITORIES
            </span>

          </div>

          <div className="stat-number">
            {hasData ? totalRepos : 0}
          </div>

          <p className="stat-description">
            Total Repositories
          </p>

          {/* REPOSITORIES GRAPH */}

          {hasData && (
            <div className="stat-graph repositories-graph">

              <svg
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                className="analytics-chart"
              >

                <defs>

                  <linearGradient
                    id="repoGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.45"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.03"
                    />

                  </linearGradient>

                </defs>

                {/* COLORED GRAPH AREA */}

                <path
                  d="
                    M0,100
                    L30,90
                    L60,94
                    L90,65
                    L120,75
                    L150,52
                    L180,68
                    L210,38
                    L240,58
                    L270,45
                    L300,68
                    L330,50
                    L360,40
                    L390,58
                    L420,30
                    L450,42
                    L500,15
                    L500,120
                    L0,120
                    Z
                  "
                  fill="url(#repoGradient)"
                />

                {/* GRAPH LINE */}

                <path
                  d="
                    M0,100
                    L30,90
                    L60,94
                    L90,65
                    L120,75
                    L150,52
                    L180,68
                    L210,38
                    L240,58
                    L270,45
                    L300,68
                    L330,50
                    L360,40
                    L390,58
                    L420,30
                    L450,42
                    L500,15
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* FINAL POINT */}

                <circle
                  cx="500"
                  cy="15"
                  r="4"
                  fill="currentColor"
                />

              </svg>

            </div>
          )}

        </div>

        {/* =====================================
            STARS CARD
        ===================================== */}

        <div
          className={`stat-card ${
            hasData ? "graph-card" : ""
          }`}
        >

          <div className="stat-card-top">

            <div className="stat-icon stars-icon">
              <Star size={22} />
            </div>

            <span className="stat-label">
              TOTAL STARS
            </span>

          </div>

          <div className="stat-number">
            {hasData ? totalStars : 0}
          </div>

          <p className="stat-description">
            Stars Across All Repositories
          </p>

          {/* STARS GRAPH */}

          {hasData && (
            <div className="stat-graph stars-graph">

              <svg
                viewBox="0 0 500 120"
                preserveAspectRatio="none"
                className="analytics-chart"
              >

                <defs>

                  <linearGradient
                    id="starsGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="0%"
                      stopColor="currentColor"
                      stopOpacity="0.45"
                    />

                    <stop
                      offset="100%"
                      stopColor="currentColor"
                      stopOpacity="0.03"
                    />

                  </linearGradient>

                </defs>

                {/* COLORED STARS GRAPH AREA */}

                <path
                  d="
                    M0,105
                    L30,82
                    L60,96
                    L90,58
                    L120,75
                    L150,42
                    L180,68
                    L210,32
                    L240,55
                    L270,72
                    L300,38
                    L330,60
                    L360,25
                    L390,48
                    L420,18
                    L450,35
                    L500,10
                    L500,120
                    L0,120
                    Z
                  "
                  fill="url(#starsGradient)"
                />

                {/* STARS GRAPH LINE */}

                <path
                  d="
                    M0,105
                    L30,82
                    L60,96
                    L90,58
                    L120,75
                    L150,42
                    L180,68
                    L210,32
                    L240,55
                    L270,72
                    L300,38
                    L330,60
                    L360,25
                    L390,48
                    L420,18
                    L450,35
                    L500,10
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* FINAL POINT */}

                <circle
                  cx="500"
                  cy="10"
                  r="4"
                  fill="currentColor"
                />

              </svg>

            </div>
          )}

        </div>

      </div>

      {/* =====================================
          MOST USED LANGUAGES
      ===================================== */}

      <div className="languages-section">

        <div className="languages-heading">

          <Code2 size={18} />

          <h3>
            Most Used Languages
          </h3>

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

                    <span>
                      {language}
                    </span>

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