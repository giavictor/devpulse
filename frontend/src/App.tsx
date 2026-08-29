import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import GithubSearch from "./components/GithubSearch";
import GithubStats from "./components/GithubStats";
import RecentActivity from "./components/RecentActivity";
import SavedLinks from "./components/SavedLinks";
import Notes from "./components/Notes";

function App() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <GithubSearch />
      <GithubStats />
      <RecentActivity />
      <SavedLinks />
      <Notes />
    </>
  );
}

export default App;