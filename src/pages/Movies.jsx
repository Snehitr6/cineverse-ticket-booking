import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { movies, genres, languages } from "../data/movies";
import MovieCard from "../components/MovieCard";

function MoviesIcon({ name, size = 20 }) {
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
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="8" cy="7" r="1" /><circle cx="15" cy="12" r="1" /></>,
    film: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
  };

  return <svg {...props}>{icons[name]}</svg>;
}

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedGenre, setSelectedGenre] = useState(
    searchParams.get("genre") || "All"
  );
  const [selectedLanguage, setSelectedLanguage] = useState(
    searchParams.get("language") || "All"
  );
  const [sortBy, setSortBy] = useState("popular");

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((movie) =>
        [
          movie.title,
          movie.director,
          movie.language,
          ...(movie.genre || []),
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(query))
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((movie) =>
        movie.genre?.includes(selectedGenre)
      );
    }

    if (selectedLanguage !== "All") {
      result = result.filter(
        (movie) => movie.language === selectedLanguage
      );
    }

    if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [search, selectedGenre, selectedLanguage, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("All");
    setSelectedLanguage("All");
    setSortBy("popular");
    setSearchParams({});
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);

    const params = new URLSearchParams(searchParams);
    if (genre === "All") params.delete("genre");
    else params.set("genre", genre);

    setSearchParams(params);
  };

  const handleSearchChange = (value) => {
    setSearch(value);

    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("search", value);
    else params.delete("search");

    setSearchParams(params);
  };

  return (
    <main className="page-container min-h-screen py-10 sm:py-14">
      {/* Page heading */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950/60 via-[#171323] to-[#0e0c16] p-6 sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-violet-300">
            The Cineverse collection
          </p>

          <h1 className="font-['Space_Grotesk'] text-4xl font-bold sm:text-5xl lg:text-6xl">
            Find your next
            <span className="block text-violet-300">movie moment.</span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-7 text-gray-400 sm:text-base">
            Explore unforgettable stories, discover hidden gems, and book
            your favourite seats for the big screen.
          </p>

          <div className="mt-7 flex flex-wrap gap-5 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <MoviesIcon name="film" size={17} />
              {movies.length} movies to explore
            </span>
            <span>Easy ticket booking</span>
          </div>
        </div>
      </section>

      {/* Search and sort */}
      <section>
        <div className="flex flex-col gap-4 md:flex-row">
          <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 transition focus-within:border-violet-500">
            <span className="text-gray-500">
              <MoviesIcon name="search" size={20} />
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Search movies, genres or directors..."
              aria-label="Search movies"
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-white outline-none placeholder:text-gray-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                aria-label="Clear search"
                className="text-gray-500 transition hover:text-white"
              >
                <MoviesIcon name="close" size={18} />
              </button>
            )}
          </label>

          <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4">
            <span className="text-xs text-gray-500">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="min-w-0 flex-1 bg-transparent py-4 text-sm text-white outline-none sm:flex-none"
              aria-label="Sort movies"
            >
              <option className="bg-[#171521]" value="popular">Featured</option>
              <option className="bg-[#171521]" value="rating">Top rated</option>
              <option className="bg-[#171521]" value="price-low">Price: low to high</option>
              <option className="bg-[#171521]" value="price-high">Price: high to low</option>
              <option className="bg-[#171521]" value="title">Title: A–Z</option>
            </select>
          </label>
        </div>

        {/* Genre filters */}
        <div className="mt-7">
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <MoviesIcon name="filter" size={16} />
            Genres
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => handleGenreChange(genre)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                  selectedGenre === genre
                    ? "border-violet-500 bg-violet-500 text-white"
                    : "border-white/10 bg-white/[0.03] text-gray-400 hover:border-violet-400/50 hover:text-white"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Language filters */}
        <div className="mt-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gray-500">
            Language
          </p>

          <div className="flex flex-wrap gap-2">
            {languages.map((language) => (
              <button
                key={language}
                type="button"
                onClick={() => setSelectedLanguage(language)}
                className={`rounded-lg border px-3.5 py-2 text-xs font-semibold transition ${
                  selectedLanguage === language
                    ? "border-violet-500/50 bg-violet-500/10 text-violet-200"
                    : "border-white/10 text-gray-400 hover:text-white"
                }`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="mt-10">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-['Space_Grotesk'] text-2xl font-bold sm:text-3xl">
              {selectedGenre === "All" ? "Explore movies" : selectedGenre}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {filteredMovies.length}{" "}
              {filteredMovies.length === 1 ? "movie" : "movies"} found
            </p>
          </div>

          {(search || selectedGenre !== "All" ||
            selectedLanguage !== "All" || sortBy !== "popular") && (
            <button
              type="button"
              onClick={clearFilters}
              className="shrink-0 text-sm font-semibold text-violet-300 transition hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 xl:grid-cols-5">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] px-5 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
              <MoviesIcon name="search" size={28} />
            </div>
            <h3 className="mt-5 text-xl font-bold">No movies found</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another title or change your filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="gradient-button mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold"
            >
              Clear all filters
              <MoviesIcon name="arrow" size={17} />
            </button>
          </div>
        )}
      </section>
    </main>
  );
}

