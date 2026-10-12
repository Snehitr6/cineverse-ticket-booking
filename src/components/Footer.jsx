import { Link } from "react-router-dom";

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const paths = {
    clapper: (
      <>
        <path d="M4 4h16v16H4z" />
        <path d="m4 4 4 4M12 4l4 4M20 4l-4 4M4 12h16" />
      </>
    ),
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    map: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v12h14V9M9 21v-7h6v7" /></>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>,
    facebook: <path fill="currentColor" stroke="none" d="M13.5 21v-8.2h2.75l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14c-.3-.04-1.34-.14-2.55-.14-2.53 0-4.26 1.54-4.26 4.37V9.6H7.12v3.2h2.86V21h3.52Z" />,
    youtube: <><path d="M22 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.2 4.9 12 4.9 12 4.9s-4.2 0-7.1.2c-.4.1-1.3.1-2.1.9C2.2 6.6 2 8 2 8s-.2 1.6-.2 3.2v1.5C1.8 14.3 2 16 2 16s.2 1.4.8 2c.8.8 1.9.8 2.4.9 1.7.2 6.8.2 6.8.2s4.2 0 7.1-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.5C22.2 9.6 22 8 22 8Z" /><path d="m10 9 5 3-5 3z" fill="currentColor" stroke="none" /></>,
  };

  return <svg {...common}>{paths[name]}</svg>;
}

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { name: "Instagram", icon: "instagram", url: "https://www.instagram.com/" },
    { name: "Facebook", icon: "facebook", url: "https://www.facebook.com/" },
    { name: "YouTube", icon: "youtube", url: "https://www.youtube.com/" },
  ];

  const linkClass = "transition-colors duration-200 hover:text-violet-300";

  return (
    <footer className="mt-20 border-t border-white/10 bg-[#0b0a12] text-gray-300">
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg shadow-violet-900/30">
                <Icon name="clapper" size={23} />
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-white">
                cine<span className="text-violet-400">verse</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm leading-7 text-gray-400">
              Your next great movie experience starts here. Discover films,
              choose your seats, and book your perfect show.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
              <Icon name="heart" size={15} />
              Made for movie lovers
            </div>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className={linkClass}>Home</Link></li>
              <li><Link to="/movies" className={linkClass}>All Movies</Link></li>
              <li><Link to="/movies?genre=Action" className={linkClass}>Action Movies</Link></li>
              <li><Link to="/movies?genre=Sci-Fi" className={linkClass}>Sci-Fi Movies</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Your Experience
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/movies" className={linkClass}>Book Tickets</Link></li>
              <li><Link to="/login" className={linkClass}>Sign In</Link></li>
              <li><Link to="/signup" className={linkClass}>Create Account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-5 text-sm font-bold uppercase tracking-widest text-white">
              Stay Connected
            </h3>
            <p className="text-sm leading-6 text-gray-400">
              Follow Cineverse for movie discoveries and updates.
            </p>

            <div className="mt-5 flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition duration-200 hover:-translate-y-1 hover:border-violet-500 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  <Icon name={social.icon} size={19} />
                </a>
              ))}
            </div>

            <a
              href="mailto:support@cineverse.example"
              className={`mt-5 inline-flex items-center gap-2 text-sm text-gray-400 ${linkClass}`}
            >
              <Icon name="mail" size={16} />
              Contact support
              <Icon name="arrow" size={14} />
            </a>

            <p className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <Icon name="map" size={14} />
              Bengaluru, India
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Cineverse. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <Link to="/" className={linkClass}>Privacy</Link>
            <Link to="/" className={linkClass}>Terms</Link>
            <span className="text-violet-300">Made for the big screen ✦</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
