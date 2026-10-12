import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupIcon({ name, size = 20 }) {
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
    film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>,
    eyeOff: <><path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 7 10 7c1.3 0 2.5-.3 3.5-.8" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2L12 3Z" /></>,
  };

  return <svg {...props}>{icons[name]}</svg>;
}

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the terms to continue.");
      return;
    }

    try {
      // Demo profile only; do not store passwords in localStorage.
      const user = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };

      localStorage.setItem("cineverse-demo-user", JSON.stringify(user));
      navigate("/movies", { replace: true });
    } catch {
      setError("Unable to create your profile. Please try again.");
    }
  };

  return (
    <main className="page-container flex min-h-[78vh] items-center justify-center py-12 sm:py-16">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#14121f] shadow-2xl shadow-black/30 lg:grid-cols-2">
        {/* Visual panel */}
        <section className="relative hidden min-h-[680px] overflow-hidden lg:block">
          <img
            src="https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg"
            alt="Cinematic space scene"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#100d1c] via-[#100d1c]/55 to-violet-950/20" />

          <div className="relative flex h-full flex-col justify-between p-10">
            <Link to="/" className="inline-flex w-fit items-center gap-3 text-white">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600">
                <SignupIcon name="film" size={24} />
              </span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold">
                cine<span className="text-violet-300">verse</span>
              </span>
            </Link>

            <div className="pb-5">
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-semibold text-violet-200 backdrop-blur-md">
                <SignupIcon name="sparkle" size={15} />
                YOUR NEXT MOVIE NIGHT
              </span>

              <h1 className="max-w-md font-['Space_Grotesk'] text-5xl font-bold leading-tight text-white">
                Your front-row seat to unforgettable stories.
              </h1>

              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-300">
                Create your Cineverse profile and discover movies worth
                watching on the big screen.
              </p>

              <div className="mt-7 flex items-center gap-3 text-sm text-gray-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <SignupIcon name="check" size={17} />
                </span>
                Discover and book your favourite films
              </div>
            </div>
          </div>
        </section>

        {/* Signup form */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white lg:hidden"
            >
              <SignupIcon name="film" size={20} />
              <span className="font-bold">cineverse</span>
            </Link>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
              Join the experience
            </p>

            <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white sm:text-4xl">
              Create your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Start discovering movies and planning your next cinema visit.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="signup-name" className="mb-2 block text-sm font-medium text-gray-300">
                  Full name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <SignupIcon name="user" size={19} />
                  </span>
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Your full name"
                    required
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="mb-2 block text-sm font-medium text-gray-300">
                  Email address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <SignupIcon name="mail" size={19} />
                  </span>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="mb-2 block text-sm font-medium text-gray-300">
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <SignupIcon name="lock" size={19} />
                  </span>
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    required
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="text-gray-500 transition hover:text-white"
                  >
                    <SignupIcon name={showPassword ? "eyeOff" : "eye"} size={19} />
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label htmlFor="signup-confirm-password" className="mb-2 block text-sm font-medium text-gray-300">
                  Confirm password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
                  <span className="text-gray-500">
                    <SignupIcon name="lock" size={19} />
                  </span>
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="text-gray-500 transition hover:text-white"
                  >
                    <SignupIcon name={showConfirmPassword ? "eyeOff" : "eye"} size={19} />
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-3 pt-1 text-xs leading-5 text-gray-400">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) => setAcceptedTerms(event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-violet-500"
                />
                <span>
                  I agree to the terms of use and privacy policy for this demo
                  application.
                </span>
              </label>

              {error && (
                <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="gradient-button flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5"
              >
                Create account
                <SignupIcon name="arrow" size={18} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-violet-300 transition hover:text-violet-200">
                Sign in
              </Link>
            </p>

            <p className="mt-5 text-center text-xs leading-5 text-gray-500">
              Demo frontend only. Account details are not verified by a server.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
