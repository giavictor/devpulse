import {
  Activity,
  Bookmark,
  LayoutDashboard,
  Search,
  StickyNote,
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar = ({
  activeSection,
  setActiveSection,
}: SidebarProps) => {
  const menuItems = [
    {
      name: "GitHub Search",
      icon: Search,
    },
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Saved Links",
      icon: Bookmark,
    },
    {
      name: "Notes",
      icon: StickyNote,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <Activity size={22} />
        </div>

        <h1>DevPulse</h1>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`sidebar-item ${
                activeSection === item.name ? "active" : ""
              }`}
              onClick={() => setActiveSection(item.name)}
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;