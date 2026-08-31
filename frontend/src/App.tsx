import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import GithubSearch from "./components/GithubSearch";
import SavedLinks from "./components/SavedLinks";
import Notes from "./components/Notes";

import type {
  GithubRepo,
  GithubEvent,
} from "./services/githubApi";

function App() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);

  return (
    <>
      <Navbar />

      <GithubSearch
        onReposLoaded={setRepos}
        onEventsLoaded={setEvents}
      />

      <Dashboard
        repos={repos}
        events={events}
      />

      <SavedLinks />
      <Notes />
    </>
  );
}

export default App;