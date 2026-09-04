export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          
          {/* Logo */}
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            DevPulse
          </h1>

          {/* Navigation */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm sm:text-base">
            <a
              href="#dashboard"
              className="text-gray-600 hover:text-blue-600"
            >
              Dashboard
            </a>

            <a
              href="#links"
              className="text-gray-600 hover:text-blue-600"
            >
              Saved Links
            </a>

            <a
              href="#notes"
              className="text-gray-600 hover:text-blue-600"
            >
              Notes
            </a>
          </div>

        </div>
      </div>
    </nav>
  );
}