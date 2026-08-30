import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import GithubSearch from "./components/GithubSearch";
import GithubStats from "./components/GithubStats";
import RecentActivity from "./components/RecentActivity";
import SavedLinks from "./components/SavedLinks";
import Notes from "./components/Notes";

import type { GithubRepo } from "./services/githubApi";

function App() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);

  return (
    <>
      <Navbar />
      <Dashboard />

      <GithubSearch onReposLoaded={setRepos} />

      <GithubStats repos={repos} />

      <RecentActivity />
      <SavedLinks />
      <Notes />
    </>
  );
}

export default App;