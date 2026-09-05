import { useEffect, useState } from "react";
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

  const [activeSection, setActiveSection] =
    useState("GitHub Search");

  // Sidebar click → smooth scroll
  const handleSectionChange = (section: string) => {
    setActiveSection(section);

    const sectionIds: Record<string, string> = {
      "GitHub Search": "search",
      "Dashboard": "dashboard",
      "Saved Links / Notes": "resources",
    };

    const elementId = sectionIds[section];

    if (!elementId) return;

    const element = document.getElementById(elementId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Update active sidebar item while scrolling
  useEffect(() => {
    const handleScroll = () => {
      const search = document.getElementById("search");
      const dashboard = document.getElementById("dashboard");
      const resources = document.getElementById("resources");

      if (!search || !dashboard || !resources) return;

      const scrollPosition =
        window.scrollY + window.innerHeight / 3;

      const searchTop = search.offsetTop;
      const dashboardTop = dashboard.offsetTop;
      const resourcesTop = resources.offsetTop;

      if (
        scrollPosition >= resourcesTop
      ) {
        setActiveSection("Saved Links / Notes");
      } else if (
        scrollPosition >= dashboardTop
      ) {
        setActiveSection("Dashboard");
      } else if (
        scrollPosition >= searchTop
      ) {
        setActiveSection("GitHub Search");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Check current position when page loads
    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  return (
    <div className="app-layout">

      {/* SIDEBAR */}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={handleSectionChange}
      />

      {/* MAIN CONTENT */}
      <main className="main-content">

        {/* GITHUB SEARCH */}
        <section id="search">
          <GithubSearch
            onReposLoaded={setRepos}
            onEventsLoaded={setEvents}
          />
        </section>

        {/* DASHBOARD */}
        <section id="dashboard">
          <Dashboard
            repos={repos}
            events={events}
          />
        </section>

        {/* SAVED LINKS + NOTES */}
        <section id="resources">
          <div className="bottom-grid">

            <section id="links">
              <SavedLinks />
            </section>

            <section id="notes">
              <Notes />
            </section>

          </div>
        </section>

      </main>
    </div>
  );
}

export default App;