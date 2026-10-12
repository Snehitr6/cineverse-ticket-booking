import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function LoginIcon({ name, size = 20 }) {
  const props = {
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

  const icons = {
    film: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
        <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.8" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    sparkle: (
      <>
        <path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" />
        <path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Demo authentication for this frontend project.
      // Connect a real authentication API before production use.
      const user = {
        email: email.trim().toLowerCase(),
        name: email.trim().split("@")[0],
      };

      localStorage.setItem("cineverse-demo-user", JSON.stringify(user));

      const destination = location.state?.from || "/movies";
      navigate(
        typeof destination === "string" ? destination : destination.pathname || "/movies",
        { replace: true }
      );
    } catch {
      setError("Unable to sign in. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="page-container flex min-h-[78vh] items-center justify-center py-12 sm:py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#14121f] shadow-2xl shadow-black/30 lg:grid-cols-2">
        {/* Left visual panel */}
        <section className="relative hidden min-h-[600px] overflow-hidden lg:block">
          <img
            src="https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg"
            alt="Cinematic space scene"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#100d1c] via-[#100d1c]/45 to-violet-950/20" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <Link to="/" className="inline-flex w-fit items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600">
                <LoginIcon name="film" size={24} />
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold">
                cine<span className="text-violet-300">verse</span>
              </span>
            </Link>

            <div className="pb-4">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold text-violet-200 backdrop-blur-md">
                <LoginIcon name="sparkle" size={15} />
                YOUR CINEMA EXPERIENCE
              </span>

              <h1 className="max-w-md font-['Space_Grotesk'] text-5xl font-bold leading-tight text-white">
                Every great story starts with a seat.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-300">
                Discover your next favourite film and make your next movie
                night unforgettable.
              </p>
            </div>
          </div>
        </section>

        {/* Login form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-9 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white lg:hidden"
            >
              <LoginIcon name="film" size={20} />
              <span className="font-bold">cineverse</span>
            </Link>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              Welcome back
            </p>

            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
              Sign in to Cineverse
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Sign in to continue exploring movies and booking tickets.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-gray-300">
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <LoginIcon name="mail" size={19} />
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <LoginIcon name="lock" size={19} />
                  </span>

                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-gray-500 transition hover:text-white"
                  >
                    <LoginIcon name={showPassword ? "eyeOff" : "eye"} size={19} />
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="gradient-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <LoginIcon name="arrow" size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-gray-400">
              New to Cineverse?{" "}
              <Link to="/signup" className="font-semibold text-violet-300 transition hover:text-violet-200">
                Create an account
              </Link>
            </p>

            <p className="mt-6 text-center text-xs leading-5 text-gray-500">
              Demo frontend only. This form does not verify credentials against
              a server.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
