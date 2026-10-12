
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clapperboard,
  Clock3,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
} from "lucide-react";

import { movies, genres } from "../data/movies";
import MovieCard from "../components/MovieCard";
import MovieCarousel from "../components/MovieCarousel";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function formatLanguage(language) {
  if (Array.isArray(language)) return language.join(" · ");
  if (typeof language === "string") return language;
  return "English";
}

function formatGenres(genre) {
  if (Array.isArray(genre)) return genre.join(" · ");
  return genre || "Cinema";
}

function getGenreList() {
  const availableGenres = Array.isArray(genres)
    ? genres.filter((genre) => genre !== "All")
    : [];

  return ["All", ...availableGenres];
}

export default function Home() {
  const navigate = useNavigate();

  const [activeGenre, setActiveGenre] = useState("All");
  const [search, setSearch] = useState("");

  const featured =
    movies.find((movie) => movie.id === "interstellar") || movies[0];

  const filteredMovies = useMemo(() => {
    const query = search.toLowerCase().trim();

    return movies.filter((movie) => {
      const movieGenres = Array.isArray(movie.genre)
        ? movie.genre
        : [movie.genre];

      const matchesGenre =
        activeGenre === "All" || movieGenres.includes(activeGenre);

      const matchesSearch = movie.title
        .toLowerCase()
        .includes(query);

      return matchesGenre && matchesSearch;
    });
  }, [activeGenre, search]);

  const trendingMovies = useMemo(
    () =>
      [...movies]
        .sort(
          (a, b) => Number(b.rating || 0) - Number(a.rating || 0)
        )
        .slice(0, 6),
    []
  );

  const latestMovies = useMemo(
    () =>
      [...movies]
        .sort(
          (a, b) =>
            new Date(b.releaseDate || 0) -
            new Date(a.releaseDate || 0)
        )
        .slice(0, 6),
    []
  );

  const handleSearch = (event) => {
    event.preventDefault();

    navigate(
      search.trim()
        ? `/movies?search=${encodeURIComponent(search.trim())}`
        : "/movies"
    );
  };

  if (!featured) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-[#080b14] px-6 text-white">
        <div className="text-center">
          <Clapperboard
            size={48}
            className="mx-auto mb-5 text-red-500"
          />
          <h1 className="mb-3 text-3xl font-bold">
            Welcome to Cineverse
          </h1>
          <p className="text-gray-400">
            Movies will appear here once they are added.
          </p>
        </div>
      </main>
    );
  }

  const heroImage = featured.backdrop || featured.poster;

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#080b14] text-white">
      {/* HERO SECTION */}
      <section className="relative flex min-h-[440px] w-full items-center overflow-hidden sm:min-h-[500px] lg:min-h-[560px]">
        {/* Background image */}
        <div className="absolute inset-0 bg-[#080b14]">
          <img
            key={heroImage}
            src={heroImage}
            alt={`${featured.title} background`}
            className="h-full w-full object-cover object-[center_25%]"
            fetchPriority="high"
          />

          {/* Image overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b14] via-[#080b14]/80 to-[#080b14]/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b14] via-transparent to-[#080b14]/20" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 mx-auto w-full max-w-none px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16 xl:px-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/15 px-4 py-2 text-xs font-semibold text-red-300 backdrop-blur-md sm:text-sm">
              <Sparkles size={15} />
              THE ULTIMATE MOVIE EXPERIENCE
            </div>

            <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-red-400 sm:text-sm">
              Featured on Cineverse
            </p>

            <h1 className="mb-5 text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              {featured.title}
              <span className="text-red-500">.</span>
            </h1>

            <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-gray-200">
              <span className="inline-flex items-center gap-1.5">
                <Star
                  size={17}
                  className="fill-yellow-400 text-yellow-400"
                />
                <strong>{featured.rating}</strong>
                <span className="text-gray-400">/ 10</span>
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={17} className="text-red-400" />
                {featured.duration}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Clapperboard size={17} className="text-red-400" />
                {formatGenres(featured.genre)}
              </span>

              <span className="rounded-md border border-white/30 px-2 py-0.5 text-xs font-semibold">
                {featured.certificate || "UA"}
              </span>
            </div>

            <p className="mb-3 max-w-2xl text-sm leading-relaxed text-gray-300 sm:text-base lg:text-lg">
              {featured.description}
            </p>

            <p className="mb-7 text-sm text-gray-400">
              Language:{" "}
              <span className="font-medium text-white">
                {formatLanguage(featured.language)}
              </span>
            </p>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to={`/movie/${featured.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-red-500 hover:shadow-xl hover:shadow-red-600/20 sm:px-6 sm:py-4 sm:text-base"
              >
                <Ticket size={19} />
                Book Tickets
                <ArrowRight size={18} />
              </Link>

              <Link
                to={`/movie/${featured.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:px-6 sm:py-4 sm:text-base"
              >
                <Play size={18} />
                Movie Details
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080b14] to-transparent" />
      </section>

      {/* QUICK FEATURES */}
      <section className="relative z-10 mx-auto mb-16 mt-5 w-full px-5 sm:px-8 lg:mb-20 lg:mt-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: Ticket,
              title: "Easy Booking",
              text: "Book your favorite seats in seconds.",
            },
            {
              icon: CalendarDays,
              title: "Flexible Showtimes",
              text: "Choose a show that fits your schedule.",
            },
            {
              icon: ShieldCheck,
              title: "Instant Confirmation",
              text: "Get your booking details immediately.",
            },
          ].map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.45 }}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#121725]/95 p-5 backdrop-blur-lg transition-colors hover:border-red-500/30 sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/15 text-red-400">
                  <Icon size={23} />
                </div>

                <div>
                  <h3 className="mb-1 text-base font-bold">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* NOW SHOWING */}
      <section className="mx-auto w-full px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20 xl:px-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
        >
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Explore the big screen
              </p>

              <h2 className="text-3xl font-black sm:text-4xl">
                Now <span className="text-red-500">Showing</span>
              </h2>

              <p className="mt-3 text-sm text-gray-400 sm:text-base">
                Discover your next unforgettable movie experience.
              </p>
            </div>

            <Link
              to="/movies"
              className="inline-flex items-center gap-2 text-sm font-semibold text-red-400 transition-colors hover:text-red-300"
            >
              View All Movies
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mb-7 flex max-w-xl items-center gap-3 rounded-xl border border-white/10 bg-[#121725] px-4 py-3 focus-within:border-red-500/50"
          >
            <Search size={20} className="shrink-0 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search movies..."
              className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
              aria-label="Search movies"
            />

            <button
              type="submit"
              className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold transition-colors hover:bg-red-500 sm:text-sm"
            >
              Search
            </button>
          </form>

          {/* Genre filters */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {getGenreList().map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => setActiveGenre(genre)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeGenre === genre
                    ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                    : "border border-white/10 bg-[#151b29] text-gray-400 hover:border-red-500/40 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Movie cards */}
          {filteredMovies.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
              {filteredMovies.slice(0, 8).map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-[#121725] py-16 text-center">
              <Search
                size={35}
                className="mx-auto mb-4 text-gray-500"
              />

              <h3 className="mb-2 text-xl font-bold">
                No movies found
              </h3>

              <p className="mb-5 text-sm text-gray-400">
                Try another movie title or genre.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveGenre("All");
                }}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold hover:bg-red-500"
              >
                Clear Filters
              </button>
            </div>
          )}
        </motion.div>
      </section>

      {/* TRENDING MOVIES */}
      <section className="border-y border-white/5 bg-[#0d111d] py-14 sm:py-16 lg:py-20">
        <div className="mx-auto w-full px-5 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                Audience favorites
              </p>

              <h2 className="text-3xl font-black sm:text-4xl">
                Trending <span className="text-red-500">Movies</span>
              </h2>
            </div>

            <Link
              to="/movies"
              className="flex shrink-0 items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300"
            >
              Explore <ChevronRight size={18} />
            </Link>
          </div>

          <MovieCarousel movies={trendingMovies} />
        </div>
      </section>

      {/* EXPLORE CINEMA */}
      <section className="mx-auto w-full px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              More to discover
            </p>

            <h2 className="text-3xl font-black sm:text-4xl">
              Explore <span className="text-red-500">Cinema</span>
            </h2>
          </div>

          <Link
            to="/movies"
            className="flex shrink-0 items-center gap-1 text-sm font-semibold text-red-400 hover:text-red-300"
          >
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <MovieCarousel movies={latestMovies} />
      </section>

      {/* BOOKING CTA */}
      <section className="mx-auto w-full px-5 pb-16 sm:px-8 lg:px-12 lg:pb-20 xl:px-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#36111c] via-[#1b1220] to-[#101522] px-6 py-12 text-center sm:px-12 sm:py-16 lg:py-20"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-600/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-400">
              <Ticket size={30} />
            </div>

            <h2 className="mb-5 text-3xl font-black sm:text-5xl">
              Your Next Movie Night
              <br />
              <span className="text-red-500">Starts Here.</span>
            </h2>

            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-gray-300 sm:text-base">
              Explore amazing movies, choose your perfect seats, and
              enjoy a seamless ticket booking experience.
            </p>

            <Link
              to="/movies"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-8 py-4 font-bold transition-all duration-300 hover:-translate-y-1 hover:bg-red-500 hover:shadow-xl hover:shadow-red-600/20"
            >
              Explore All Movies
              <ArrowRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}