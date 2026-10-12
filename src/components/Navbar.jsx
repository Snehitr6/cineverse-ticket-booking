import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();

    if (query) {
      navigate(`/movies?search=${encodeURIComponent(query)}`);
      setSearch("");
      setSearchOpen(false);
      setMenuOpen(false);
    }
  };

  const linkStyle = ({ isActive }) =>
    `text-sm font-medium transition ${
      isActive ? "text-violet-300" : "text-gray-300 hover:text-white"
    }`;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0c0b13]/95 backdrop-blur-xl">
      {/* Full-width navbar container */}
      <div className="w-full px-4 sm:px-5 lg:px-6">
        <div className="flex h-[72px] w-full items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xl text-white">
              🎬
            </span>

            <span className="font-['Space_Grotesk'] text-xl sm:text-2xl font-bold text-white">
              cine<span className="text-violet-400">verse</span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-5 lg:gap-7 md:flex">
            <NavLink to="/" end className={linkStyle}>
              Home
            </NavLink>

            <NavLink to="/movies" className={linkStyle}>
              Movies
            </NavLink>

            <NavLink to="/booking/seats" className={linkStyle}>
              Book Tickets
            </NavLink>
          </nav>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-2 sm:gap-3 md:flex">
            {searchOpen && (
              <form onSubmit={submitSearch}>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search movies..."
                  aria-label="Search movies"
                  className="w-36 lg:w-44 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-violet-500"
                  autoFocus
                />
              </form>
            )}

            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Toggle search"
              className="rounded-xl px-3 py-2 text-lg text-gray-300 hover:bg-white/10 hover:text-white"
            >
              {searchOpen ? "✕" : "⌕"}
            </button>

            <Link
              to="/login"
              className="whitespace-nowrap rounded-xl border border-white/10 px-3 lg:px-4 py-2.5 text-sm font-semibold text-white transition hover:border-violet-500"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="whitespace-nowrap rounded-xl bg-violet-600 px-3 lg:px-4 py-2.5 text-sm font-bold text-white transition hover:bg-violet-500"
            >
              Get started
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen((open) => !open)}
              aria-label="Toggle search"
              className="rounded-xl px-3 py-2 text-lg text-gray-300 hover:bg-white/10 hover:text-white"
            >
              {searchOpen ? "✕" : "⌕"}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label="Toggle navigation"
              className="rounded-xl border border-white/10 px-3 py-2 text-xl text-white"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <form onSubmit={submitSearch} className="pb-4 md:hidden">
            <div className="flex gap-2">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search movies..."
                aria-label="Search movies"
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-violet-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white"
              >
                Search
              </button>
            </div>
          </form>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="space-y-1 border-t border-white/10 py-4 md:hidden">
            <NavLink
              to="/"
              end
              onClick={closeMenu}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/movies"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Movies
            </NavLink>

            <NavLink
              to="/booking/seats"
              onClick={closeMenu}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-3 text-sm ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-gray-300 hover:bg-white/5"
                }`
              }
            >
              Book Tickets
            </NavLink>

            <div className="grid grid-cols-2 gap-3 px-2 pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-white/10 px-3 py-3 text-center text-sm font-semibold text-white"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="rounded-xl bg-violet-600 px-3 py-3 text-center text-sm font-bold text-white"
              >
                Sign up
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
