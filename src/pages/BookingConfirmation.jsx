
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  CalendarDays,
  Clock3,
  MapPin,
  Armchair,
  Ticket,
  Download,
  Home,
  Film,
  ShieldCheck,
  ArrowRight,
  Clapperboard,
} from "lucide-react";

import { movies } from "../data/movies";
import { useBooking } from "../context/BookingContext";

function formatDate(value) {
  if (!value) return "Date not selected";

  const date = new Date(
    String(value).includes("T") ? value : `${value}T12:00:00`
  );

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-500/10 text-violet-300">
        <Icon size={19} />
      </div>

      <div className="min-w-0 pt-0.5">
        <p className="mb-1 text-xs text-slate-500">{label}</p>
        <div className="break-words text-sm font-semibold text-white">
          {children}
        </div>
      </div>
    </div>
  );
}

function PriceRow({ label, amount, strong = false }) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        strong ? "text-white" : "text-slate-400"
      }`}
    >
      <span className={strong ? "font-bold" : "text-sm"}>{label}</span>

      <span
        className={
          strong ? "text-xl font-black" : "text-sm font-medium"
        }
      >
        ₹{Number(amount || 0).toLocaleString("en-IN")}
      </span>
    </div>
  );
}

/* Poster fallback: poster -> backdrop -> styled placeholder */
function MoviePoster({ movie }) {
  const [imageStage, setImageStage] = useState(0);

  const currentMovie =
    movies.find(
      (item) => String(item.id) === String(movie?.id)
    ) ||
    movies.find(
      (item) =>
        item.title?.toLowerCase() === movie?.title?.toLowerCase()
    );

  const title = currentMovie?.title || movie?.title || "Movie";

  const poster = currentMovie?.poster || movie?.poster || "";
  const backdrop = currentMovie?.backdrop || movie?.backdrop || "";

  const imageSources = [...new Set([poster, backdrop].filter(Boolean))];
  const imageSrc = imageSources[imageStage] || "";

  return (
    <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-violet-950 via-[#211a35] to-[#09080e] shadow-xl sm:h-48 sm:w-36">
      {imageSrc ? (
        <img
          key={imageSrc}
          src={imageSrc}
          alt={`${title} poster`}
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => {
            setImageStage((stage) =>
              Math.min(stage + 1, imageSources.length)
            );
          }}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-violet-950 via-[#211a35] to-[#09080e] p-3 text-center">
          <Film size={32} className="text-violet-300" />

          <span className="text-sm font-bold leading-tight text-white">
            {title}
          </span>

          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-violet-300">
            CINEVERSE
          </span>
        </div>
      )}
    </div>
  );
}

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const { booking, resetBooking } = useBooking();

  const details = useMemo(() => {
    const rawMovie = booking?.movie;

    const movieId =
      rawMovie && typeof rawMovie === "object"
        ? rawMovie.id
        : rawMovie ?? booking?.movieId;

    const movie =
      movies.find(
        (item) => String(item.id) === String(movieId)
      ) ||
      (rawMovie && typeof rawMovie === "object" ? rawMovie : null) ||
      movies.find(
        (item) =>
          item.title?.toLowerCase() ===
          String(booking?.movieTitle || "").toLowerCase()
      ) ||
      movies.find((item) => item.id === "interstellar");

    const rawTheatre = booking?.theatre;

    const theatreName =
      typeof rawTheatre === "string"
        ? rawTheatre
        : rawTheatre?.name || rawTheatre?.label || "Cineverse";

    const theatreLocation =
      rawTheatre && typeof rawTheatre === "object"
        ? rawTheatre.location || rawTheatre.address || ""
        : "";

    const seats = Array.isArray(booking?.seats)
      ? booking.seats
      : [];

    const subtotal = Number(movie?.price || 0) * seats.length;
    const convenienceFee =
      subtotal > 0 ? Math.round(subtotal * 0.02) : 0;

    return {
      movie,
      theatreName,
      theatreLocation,
      seats,
      date: booking?.date,
      showtime: booking?.showtime,
      bookingId:
        booking?.bookingId ||
        `CV${Date.now().toString().slice(-8)}`,
      subtotal,
      convenienceFee,
      total: subtotal + convenienceFee,
    };
  }, [booking]);

  const downloadTicket = () => {
    const ticketText = [
      "CINEVERSE — E-TICKET",
      "----------------------------------",
      `Booking Reference: ${details.bookingId}`,
      `Movie: ${details.movie?.title || "Movie"}`,
      `Language: ${details.movie?.language || "N/A"}`,
      `Cinema: ${details.theatreName}`,
      `Location: ${details.theatreLocation || "Please check cinema details"}`,
      `Date: ${formatDate(details.date)}`,
      `Showtime: ${details.showtime || "Not available"}`,
      `Seats: ${details.seats.join(", ") || "Not selected"}`,
      `Tickets: ${details.seats.length}`,
      `Ticket subtotal: Rs. ${details.subtotal}`,
      `Convenience fee: Rs. ${details.convenienceFee}`,
      `Total: Rs. ${details.total}`,
      "----------------------------------",
      "Thank you for booking with Cineverse!",
    ].join("\n");

    const file = new Blob([ticketText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `Cineverse-Ticket-${details.bookingId}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const handleHome = () => {
    resetBooking();
    navigate("/");
  };

  const movie = details.movie;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080910] px-4 pb-20 pt-28 text-white sm:px-6 sm:pt-32">
      <div className="pointer-events-none absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/[0.07] blur-[100px]" />

      <div className="relative mx-auto max-w-3xl">
        {/* Confirmation heading */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-emerald-400/25 bg-emerald-400/10 shadow-lg shadow-emerald-950/30">
            <CheckCircle2
              size={34}
              className="text-emerald-400"
              strokeWidth={2}
            />
          </div>

          <p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.3em] text-emerald-400">
            Booking confirmed
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            You're going to the movies!
          </h1>

          <p className="mt-4 text-sm text-slate-400 sm:text-base">
            Your ticket is ready. Sit back, relax, and enjoy the show.
          </p>
        </div>

        {/* Ticket */}
        <section className="overflow-hidden rounded-3xl border border-white/[0.09] bg-[#12121e] shadow-2xl shadow-black/30">
          {/* Movie header */}
          <div className="relative isolate overflow-hidden p-5 sm:p-8">
            {movie?.backdrop && (
              <img
                src={movie.backdrop}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover opacity-[0.12] blur-sm"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            )}

            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171421] via-[#14131e]/95 to-[#171421]/80" />

            <div className="flex gap-5 sm:gap-6">
              <MoviePoster movie={movie} />

              <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-violet-400/20 bg-violet-500/15 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-violet-200">
                  <Ticket size={12} />
                  Cineverse e-ticket
                </span>

                <h2 className="text-xl font-black leading-tight sm:text-3xl">
                  {movie?.title || "Your Movie"}
                </h2>

                <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                  {movie?.language || "Cinema"}
                  {movie?.duration ? ` · ${movie.duration}` : ""}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(movie?.genre)
                    ? movie.genre.slice(0, 2)
                    : movie?.genre
                      ? [movie.genre]
                      : []
                  ).map((genre) => (
                    <span
                      key={genre}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-slate-300"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Perforated ticket divider */}
          <div className="relative flex items-center">
            <div className="absolute -left-3 h-6 w-6 rounded-full border border-white/[0.08] bg-[#080910]" />
            <div className="mx-7 w-full border-t border-dashed border-white/15 sm:mx-8" />
            <div className="absolute -right-3 h-6 w-6 rounded-full border border-white/[0.08] bg-[#080910]" />
          </div>

          {/* Booking details */}
          <div className="p-5 sm:p-8">
            <div className="mb-7 grid grid-cols-1 gap-x-5 gap-y-6 sm:grid-cols-2 sm:gap-y-7">
              <Detail icon={CalendarDays} label="SHOW DATE">
                {formatDate(details.date)}
              </Detail>

              <Detail icon={Clock3} label="SHOWTIME">
                {details.showtime || "Not selected"}
              </Detail>

              <Detail icon={MapPin} label="CINEMA">
                <span>{details.theatreName}</span>
                {details.theatreLocation && (
                  <span className="mt-1 block text-xs font-normal text-slate-400">
                    {details.theatreLocation}
                  </span>
                )}
              </Detail>

              <Detail icon={Armchair} label="YOUR SEATS">
                {details.seats.length > 0
                  ? details.seats.join(", ")
                  : "No seats selected"}

                <span className="mt-1 block text-xs font-normal text-slate-400">
                  {details.seats.length}{" "}
                  {details.seats.length === 1 ? "ticket" : "tickets"}
                </span>
              </Detail>
            </div>

            {/* Booking reference */}
            <div className="mb-7 flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1 text-xs text-slate-500">
                  BOOKING REFERENCE
                </p>

                <p className="font-mono text-lg font-extrabold tracking-wider text-violet-300">
                  {details.bookingId}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400">
                <ShieldCheck size={17} />
                Booking confirmed
              </div>
            </div>

            {/* Price summary */}
            <div className="space-y-4 border-t border-white/[0.08] pt-6">
              <div className="mb-5 flex items-center gap-2">
                <Clapperboard size={17} className="text-violet-300" />
                <h3 className="font-bold">Payment summary</h3>
              </div>

              <PriceRow
                label={`Tickets (${details.seats.length})`}
                amount={details.subtotal}
              />

              <PriceRow
                label="Convenience fee"
                amount={details.convenienceFee}
              />

              <div className="my-5 border-t border-dashed border-white/10" />

              <PriceRow
                label="Total amount"
                amount={details.total}
                strong
              />

              {details.total === 0 && (
                <p className="text-xs leading-relaxed text-amber-300">
                  The total is zero because the selected movie price or
                  seats could not be found. Check your booking data.
                </p>
              )}
            </div>
          </div>

          {/* Ticket footer */}
          <div className="border-t border-white/[0.08] bg-white/[0.02] px-5 py-5 sm:px-8">
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                type="button"
                onClick={downloadTicket}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm font-bold transition hover:border-violet-400/40 hover:bg-white/[0.08]"
              >
                <Download size={18} />
                Download Ticket
              </button>

              <button
                type="button"
                onClick={handleHome}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-bold transition hover:bg-violet-500"
              >
                <Home size={18} />
                Back to Home
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-xs leading-relaxed text-slate-500">
          Please arrive a little early and keep your booking reference handy
          when entering the cinema.
        </p>

        <div className="mt-5 text-center">
          <Link
            to="/movies"
            className="text-sm font-semibold text-violet-300 transition hover:text-violet-200"
          >
            <span className="inline-flex items-center gap-2">
              <Film size={16} />
              Explore more movies
            </span>
          </Link>
        </div>
      </div>
    </main>
  );
}