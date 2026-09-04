import { useState } from "react";

import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import GithubSearch from "./components/GithubSearch";
import SavedLinks from "./components/SavedLinks";
import Notes from "./components/Notes";

import type {
  GithubRepo,
  GithubEvent,
} from "./types";

function App() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [events, setEvents] = useState<GithubEvent[]>([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-6">

        {/* GitHub Search */}
        <section
          id="search"
          className="w-full bg-white border rounded-lg p-4 sm:p-6 shadow-sm"
        >
          <GithubSearch
            onReposLoaded={setRepos}
            onEventsLoaded={setEvents}
          />
        </section>

        {/* Dashboard */}
        <section id="dashboard">
          <Dashboard
            repos={repos}
            events={events}
          />
        </section>

        {/* Saved Links and Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

          <section id="links" className="min-w-0">
            <SavedLinks />
          </section>

          <section id="notes" className="min-w-0">
            <Notes />
          </section>

        </div>

      </main>
    </div>
  );
}

export default App;