import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Clapperboard,
  Film,
  MapPin,
  Play,
  Star,
  Ticket,
  Users,
  X,
} from "lucide-react";

import { movies, theatres, showtimes } from "../data/movies";
import { useBooking } from "../context/BookingContext";
import CastImage from "../components/CastImage";

const dateOptions = Array.from({ length: 7 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);

  return {
    value: date.toISOString().split("T")[0],
    day: date.toLocaleDateString("en-US", { weekday: "short" }),
    number: date.getDate(),
    month: date.toLocaleDateString("en-US", { month: "short" }),
  };
});

const getCastPerson = (person) => {
  if (typeof person === "string") {
    return {
      name: person,
      character: "",
    };
  }

  return {
    ...person,
    name: person?.name || person?.actor || "Cast member",
    character:
      person?.character ||
      person?.role ||
      person?.as ||
      "",
  };
};

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { startBooking, updateBooking } = useBooking();

  const movie = useMemo(
    () => movies.find((item) => String(item.id) === String(id)),
    [id]
  );

  const [selectedTheatre, setSelectedTheatre] = useState(
    theatres?.[0]?.id || ""
  );

  const [selectedDate, setSelectedDate] = useState(
    dateOptions[0]?.value || ""
  );

  const [selectedTime, setSelectedTime] = useState("");

  const [showTrailer, setShowTrailer] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedTime("");
    setShowTrailer(false);
    setImageFailed(false);
  }, [id]);

  if (!movie) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08090d] px-5 text-white">
        <div className="max-w-md text-center">
          <Film className="mx-auto mb-5 h-14 w-14 text-red-500" />

          <h1 className="text-3xl font-black">
            Movie not found
          </h1>

          <p className="mt-3 text-zinc-400">
            This movie may have been removed or the link may be incorrect.
          </p>

          <button
            type="button"
            onClick={() => navigate("/movies")}
            className="mt-7 rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500"
          >
            Browse movies
          </button>
        </div>
      </main>
    );
  }

  const title = movie.title || movie.name || "Untitled movie";

  const heroImage = movie.backdrop || movie.poster || "";

  const posterImage = movie.poster || movie.backdrop || "";

  const cast = Array.isArray(movie.cast)
    ? movie.cast.map(getCastPerson)
    : [];

  const movieGenres = Array.isArray(movie.genre)
    ? movie.genre
    : Array.isArray(movie.genres)
      ? movie.genres
      : typeof movie.genre === "string"
        ? movie.genre.split(",").map((item) => item.trim()).filter(Boolean)
        : [];

  const selectedTheatreData = theatres.find(
    (item) => item.id === selectedTheatre
  );

  const rating = Number(movie.rating) || 0;

  const price = Number(movie.price) || 200;

  const trailerId = (() => {
    const value = movie.trailerUrl || movie.trailer || movie.videoUrl || "";

    if (!value) return "";

    const match = value.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    return match?.[1] || "";
  })();

  const handleBooking = () => {
    if (!selectedTheatreData) {
      window.alert("Please select a theatre.");
      return;
    }

    if (!selectedDate) {
      window.alert("Please select a date.");
      return;
    }

    if (!selectedTime) {
      window.alert("Please select a showtime.");
      return;
    }

    startBooking(movie);

    updateBooking({
      movie,
      movieId: movie.id,
      theatre: selectedTheatreData,
      date: selectedDate,
      showtime: selectedTime,
      seats: [],
      bookingId: "",
    });

    navigate("/booking/seats");
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#08090d] text-white">
      {/* HERO SECTION */}
      <section className="relative isolate min-h-[620px] overflow-hidden sm:min-h-[680px]">
        {heroImage && !imageFailed ? (
          <img
            src={heroImage}
            alt={`${title} backdrop`}
            onError={() => setImageFailed(true)}
            className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
          />
        ) : (
          <div className="absolute inset-0 -z-30 bg-gradient-to-br from-zinc-800 via-[#15151d] to-black" />
        )}

        <div className="absolute inset-0 -z-20 bg-gradient-to-r from-black via-black/80 to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#08090d] via-black/20 to-black/50" />

        <div className="mx-auto flex min-h-[620px] max-w-7xl items-center px-5 pb-16 pt-28 sm:min-h-[680px] sm:px-8 lg:px-12">
          <div className="grid w-full items-center gap-10 md:grid-cols-[minmax(0,1fr)_260px] lg:gap-16">
            <div className="max-w-3xl">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm text-zinc-200 backdrop-blur-md transition hover:border-red-500 hover:bg-red-600/20"
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-widest">
                  Now showing
                </span>

                {movie.year && (
                  <span className="rounded-md border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold text-zinc-200">
                    {movie.year}
                  </span>
                )}

                {movie.type && (
                  <span className="rounded-md border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold text-zinc-200">
                    {movie.type}
                  </span>
                )}
              </div>

              <h1 className="max-w-3xl text-4xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-zinc-300">
                {rating > 0 && (
                  <span className="inline-flex items-center gap-2 font-bold text-amber-400">
                    <Star size={17} fill="currentColor" />
                    {rating.toFixed(1)}
                    <span className="font-normal text-zinc-400">
                      / 10
                    </span>
                  </span>
                )}

                {movie.duration && (
                  <span className="inline-flex items-center gap-2">
                    <Clock3 size={16} />
                    {movie.duration}
                  </span>
                )}

                {movie.language && (
                  <span className="inline-flex items-center gap-2">
                    <Film size={16} />
                    {movie.language}
                  </span>
                )}
              </div>

              {movieGenres.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {movieGenres.map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 backdrop-blur-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base sm:leading-8">
                {movie.description ||
                  movie.overview ||
                  "Discover this movie on CINEVERSE and book your tickets for the next show."}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    document
                      .getElementById("booking-section")
                      ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3.5 font-bold shadow-lg shadow-red-950/30 transition hover:-translate-y-0.5 hover:bg-red-500"
                >
                  <Ticket size={19} />
                  Book tickets
                </button>

                {trailerId && (
                  <button
                    type="button"
                    onClick={() => setShowTrailer(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 font-bold backdrop-blur-md transition hover:bg-white/20"
                  >
                    <Play size={18} fill="currentColor" />
                    Watch trailer
                  </button>
                )}
              </div>
            </div>

            {/* POSTER */}
            <div className="hidden justify-center md:flex">
              <div className="group relative w-full max-w-[250px]">
                <div className="absolute -inset-2 rounded-2xl bg-red-600/20 opacity-0 blur-xl transition duration-500 group-hover:opacity-100" />

                {posterImage ? (
                  <img
                    src={posterImage}
                    alt={title}
                    className="relative aspect-[2/3] w-full rounded-2xl border border-white/15 object-cover shadow-2xl shadow-black/60 transition duration-500 group-hover:-translate-y-1"
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="relative flex aspect-[2/3] items-center justify-center rounded-2xl border border-white/15 bg-zinc-900 p-5 text-center text-2xl font-black">
                    {title}
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-xs text-zinc-300">
                    Available on CINEVERSE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" />
      </section>

      {/* MOVIE INFORMATION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-8 w-1 rounded-full bg-red-500" />

              <h2 className="text-2xl font-black sm:text-3xl">
                About the movie
              </h2>
            </div>

            <p className="text-sm leading-8 text-zinc-300 sm:text-base">
              {movie.description ||
                movie.overview ||
                `${title} is available to watch at selected theatres. Choose your preferred date and showtime to book tickets.`}
            </p>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Director
                </p>

                <p className="mt-2 font-bold text-white">
                  {movie.director || "Not available"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Language
                </p>

                <p className="mt-2 font-bold text-white">
                  {movie.language || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Duration
                </p>

                <p className="mt-2 font-bold text-white">
                  {movie.duration || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Ticket price starts at
                </p>

                <p className="mt-2 font-bold text-white">
                  ₹{price}
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1115] to-[#111116] p-6 sm:p-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/15 text-red-400">
                <Ticket size={22} />
              </div>

              <div>
                <p className="text-sm text-zinc-400">
                  CINEVERSE tickets
                </p>
                <h3 className="text-xl font-black">
                  Your movie night
                </h3>
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              Choose a cinema, select your date and showtime, then pick your seats.
            </p>

            <div className="my-6 h-px bg-white/10" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">
                Starting price
              </span>

              <span className="text-2xl font-black text-white">
                ₹{price}
              </span>
            </div>

            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("booking-section")
                  ?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  })
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 font-bold transition hover:bg-red-500"
            >
              Select show
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* CAST AND CREW */}
      {cast.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
                Meet the talent
              </p>

              <h2 className="text-2xl font-black sm:text-3xl">
                Cast & crew
              </h2>

              <p className="mt-2 text-sm text-zinc-400">
                The people who brought {title} to life.
              </p>
            </div>

            <span className="hidden rounded-full border border-white/10 px-4 py-2 text-xs text-zinc-400 sm:inline-flex">
              <Users size={15} className="mr-2" />
              {cast.length} members
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {cast.map((person, index) => (
              <article
                key={`${person.name}-${index}`}
                className="group min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-red-500/50 hover:bg-white/[0.06]"
              >
                <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-950 p-5">
                  <div className="h-full w-full overflow-hidden rounded-full border-2 border-white/10 transition duration-300 group-hover:border-red-500/60">
                    <CastImage person={person} />
                  </div>

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>

                <div className="p-4">
                  <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-white sm:text-base">
                    {person.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-5 text-zinc-400">
                    {person.character || "Cast member"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* THEATRE AND SHOWTIME BOOKING */}
      <section
        id="booking-section"
        className="scroll-mt-8 border-t border-white/10 bg-gradient-to-b from-[#111116] to-[#08090d] px-5 py-14 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-red-400">
              Book your experience
            </p>

            <h2 className="text-3xl font-black sm:text-4xl">
              Select your show
            </h2>

            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Pick your theatre, date and preferred showtime.
            </p>
          </div>

          {/* STEP 1: THEATRE */}
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                1
              </span>

              <h3 className="text-xl font-bold">
                Choose a theatre
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {theatres.map((theatre) => {
                const isSelected = selectedTheatre === theatre.id;

                return (
                  <button
                    type="button"
                    key={theatre.id}
                    onClick={() => {
                      setSelectedTheatre(theatre.id);
                      setSelectedTime("");
                    }}
                    className={`rounded-2xl border p-5 text-left transition ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 shadow-lg shadow-red-950/20"
                        : "border-white/10 bg-white/[0.035] hover:border-white/25"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                            isSelected
                              ? "bg-red-600 text-white"
                              : "bg-white/10 text-zinc-300"
                          }`}
                        >
                          <Film size={21} />
                        </div>

                        <div className="min-w-0">
                          <h4 className="font-bold text-white">
                            {theatre.name}
                          </h4>

                          <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-zinc-400">
                            <MapPin
                              size={14}
                              className="mt-0.5 shrink-0"
                            />
                            {theatre.location || "Location not available"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-red-500 bg-red-600"
                            : "border-white/25"
                        }`}
                      >
                        {isSelected && <Check size={14} />}
                      </span>
                    </div>

                    {Array.isArray(theatre.formats) &&
                      theatre.formats.length > 0 && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {theatre.formats.map((format) => (
                            <span
                              key={format}
                              className="rounded-md border border-white/10 bg-black/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400"
                            >
                              {format}
                            </span>
                          ))}
                        </div>
                      )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: DATE */}
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                2
              </span>

              <h3 className="text-xl font-bold">
                Select a date
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
              {dateOptions.map((date, index) => {
                const isSelected = selectedDate === date.value;

                return (
                  <button
                    type="button"
                    key={date.value}
                    onClick={() => {
                      setSelectedDate(date.value);
                      setSelectedTime("");
                    }}
                    className={`relative flex min-h-[105px] flex-col items-center justify-center rounded-2xl border px-2 py-4 transition ${
                      isSelected
                        ? "border-red-500 bg-red-600 text-white shadow-lg shadow-red-950/30"
                        : "border-white/10 bg-white/[0.035] text-zinc-300 hover:border-white/30"
                    }`}
                  >
                    <span className="text-xs font-semibold opacity-80">
                      {index === 0 ? "TODAY" : date.day.toUpperCase()}
                    </span>

                    <span className="my-1 text-3xl font-black">
                      {date.number}
                    </span>

                    <span className="text-xs opacity-80">
                      {date.month}
                    </span>

                    {isSelected && (
                      <span className="absolute right-2 top-2">
                        <Check size={13} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 3: SHOWTIME */}
          <div className="mb-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-sm font-black">
                3
              </span>

              <div>
                <h3 className="text-xl font-bold">
                  Select a showtime
                </h3>

                {selectedTheatreData && (
                  <p className="mt-1 text-xs text-zinc-500">
                    {selectedTheatreData.name}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {showtimes.map((time) => {
                const isSelected = selectedTime === time;

                return (
                  <button
                    type="button"
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`flex min-w-[125px] items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-bold transition ${
                      isSelected
                        ? "border-red-500 bg-red-600 text-white"
                        : "border-white/15 bg-white/[0.035] text-zinc-300 hover:border-red-500/60 hover:bg-red-500/10"
                    }`}
                  >
                    <Clock3 size={16} />
                    {time}

                    {isSelected && <Check size={15} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOOKING SUMMARY */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Your selection
                </p>

                <h3 className="mt-2 truncate text-xl font-black">
                  {title}
                </h3>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
                  {selectedTheatreData && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} />
                      {selectedTheatreData.name}
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={14} />
                    {selectedDate
                      ? new Date(
                          `${selectedDate}T12:00:00`
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "Select a date"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {selectedTime || "Select a showtime"}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-5 border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
                <div>
                  <p className="text-xs text-zinc-500">
                    Starting from
                  </p>

                  <p className="mt-1 text-3xl font-black">
                    ₹{price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleBooking}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-black transition hover:-translate-y-0.5 hover:bg-red-500 sm:px-7"
                >
                  Choose seats
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            {(!selectedTheatre || !selectedDate || !selectedTime) && (
              <p className="mt-4 text-xs text-zinc-500">
                Select a theatre, date and showtime before continuing.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* TRAILER MODAL */}
      {showTrailer && trailerId && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
          onClick={() => setShowTrailer(false)}
          role="presentation"
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`${title} trailer`}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <Clapperboard className="text-red-500" size={21} />

                <h3 className="font-bold">
                  {title} — Official trailer
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setShowTrailer(false)}
                className="rounded-full p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close trailer"
              >
                <X size={22} />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                key={trailerId}
                src={`https://www.youtube-nocookie.com/embed/${trailerId}?autoplay=1&rel=0`}
                title={`${title} trailer`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
