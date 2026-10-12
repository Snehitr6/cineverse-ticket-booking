
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import MovieCard from "./MovieCard";

export default function MovieCarousel({
  title = "Featured Movies",
  subtitle = "Discover your next favourite",
  movies = [],
}) {
  const carouselRef = useRef(null);

  const scroll = (direction) => {
    if (!carouselRef.current) return;

    const amount = carouselRef.current.clientWidth * 0.8;

    carouselRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <section className="w-full overflow-hidden">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            <Sparkles size={14} />
            {subtitle}
          </p>

          <h2 className="section-title">{title}</h2>
        </div>

        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Scroll movies left"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 transition hover:border-violet-500 hover:bg-violet-500/10 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Scroll movies right"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-gray-300 transition hover:border-violet-500 hover:bg-violet-500/10 hover:text-white"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <motion.div
        ref={carouselRef}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45 }}
        className="movie-carousel flex snap-x snap-mandatory gap-4 overflow-x-auto pb-5 sm:gap-5"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="w-[calc(50%-8px)] min-w-[calc(50%-8px)] snap-start sm:w-[calc(33.333%-14px)] sm:min-w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] lg:min-w-[calc(25%-15px)] xl:w-[calc(20%-16px)] xl:min-w-[calc(20%-16px)]"
          >
            <MovieCard movie={movie} index={index} />
          </div>
        ))}
      </motion.div>

      <style>{`
        .movie-carousel {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .movie-carousel::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}