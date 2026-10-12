import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Clock3, ArrowUpRight, Film } from "lucide-react";
import { Link } from "react-router-dom";

const wikiTitles = {
  "Kantara": "Kantara (film)",
  "777 Charlie": "777 Charlie",
  "Pushpa: The Rise": "Pushpa: The Rise",
  "Vikram": "Vikram (2022 film)",
  "Leo": "Leo (2023 Indian film)",
  "Ponniyin Selvan: I": "Ponniyin Selvan: I",
  "RRR": "RRR (film)",
  "KGF: Chapter 1": "K.G.F: Chapter 1",
  "Jawan": "Jawan (film)",
  "12th Fail": "12th Fail",
  "Dangal": "Dangal (film)",
  "3 Idiots": "3 Idiots",
  "Interstellar": "Interstellar (film)",
  "The Dark Knight": "The Dark Knight",
  "Inception": "Inception",
  "Dune": "Dune (2021 film)",
  "Oppenheimer": "Oppenheimer (film)",
};

export default function MovieCard({ movie }) {
  const [poster, setPoster] = useState(movie?.poster || "");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setPoster(movie?.poster || "");
    setFailed(false);
  }, [movie?.id, movie?.poster]);

  async function handleImageError() {
    if (failed) return;

    setFailed(true);

    try {
      const title =
        wikiTitles[movie.title] ||
        movie.title;

      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
      );

      if (!response.ok) throw new Error("Poster lookup failed");

      const data = await response.json();
      const imageUrl =
        data.thumbnail?.source ||
        data.originalimage?.source;

      if (imageUrl) {
        setPoster(imageUrl);
        setFailed(false);
      }
    } catch {
      setPoster("");
    }
  }

  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#15131e]"
    >
      <Link
        to={`/movie/${movie.id}`}
        aria-label={`View ${movie.title}`}
        className="block"
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-violet-950 via-[#211a35] to-[#09080e]">
          {poster ? (
            <img
              src={poster}
              alt={`${movie.title} poster`}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-5 text-center">
              <Film size={42} className="text-violet-300" />
              <span className="text-xl font-black text-white">
                {movie.title}
              </span>
              <span className="text-xs uppercase tracking-[0.25em] text-violet-300">
                {movie.year || "Now Showing"}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/85" />

          <span className="absolute left-3 top-3 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
            {movie.certificate || "UA"}
          </span>

          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-black/80 px-2 py-1 text-xs font-bold text-yellow-400">
            <Star size={12} fill="currentColor" />
            {movie.rating ?? "N/A"}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h3 className="line-clamp-2 text-lg font-extrabold text-white">
              {movie.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/80">
              {movie.year && <span>{movie.year}</span>}

              {movie.duration && (
                <span className="flex items-center gap-1">
                  <Clock3 size={12} />
                  {movie.duration}
                </span>
              )}

              {movie.language && <span>{movie.language}</span>}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-bold text-white group-hover:bg-violet-500">
                Book tickets
              </span>

              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 text-white group-hover:bg-violet-600">
                <ArrowUpRight size={19} />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
