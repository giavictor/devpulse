import type { GithubRepo } from "../types";

interface GithubStatsProps {
  repos: GithubRepo[];
}

export default function GithubStats({ repos = [] }: GithubStatsProps) {
  const totalRepos = repos.length;

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  // rest of your code...

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

  return (
    <div>
      <h2>GitHub Stats</h2>

      <div>
        <div>
          <h3>{totalRepos}</h3>
          <p>Total Repositories</p>
        </div>

        <div>
          <h3>{totalStars}</h3>
          <p>Total Stars ⭐</p>
        </div>
      </div>

      <h3>Most Used Languages</h3>

      {mostUsedLanguages.length > 0 ? (
        <ul>
          {mostUsedLanguages.map(([language, count]) => (
            <li key={language}>
              {language}: {count} repositories
            </li>
          ))}
        </ul>
      ) : (
        <p>No language data available.</p>
      )}
    </div>
  );
}