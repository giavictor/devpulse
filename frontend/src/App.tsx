import { useState } from "react";
import "./App.css";

import Sidebar from "./components/Sidebar";
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
  const [activeSection, setActiveSection] = useState("Dashboard");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);

    const sectionIds: Record<string, string> = {
      Dashboard: "dashboard",
      "GitHub Search": "search",
      "Saved Links": "links",
      Notes: "notes",
    };

    const element = document.getElementById(
      sectionIds[section]
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />

      {/* Main Content */}
      <main className="main-content">

        {/* GitHub Search */}
        <section id="search">
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
        <div className="bottom-grid">
          <section id="links">
            <SavedLinks />
          </section>

          <section id="notes">
            <Notes />
          </section>
        </div>

      </main>
    </div>
  );
}

export default App;