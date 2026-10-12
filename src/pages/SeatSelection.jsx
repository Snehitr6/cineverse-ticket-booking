import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooking } from "../context/BookingContext";

function SeatIcon({ name, size = 20 }) {
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
    back: <><path d="m15 18-6-6 6-6" /></>,
    ticket: <><path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 1 0-6V5H2v4Z" /><path d="M13 5v2m0 4v2m0 4v2" /></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    screen: <><path d="M3 5h18v12H3zM8 21h8M12 17v4" /></>,
  };

  return <svg {...props}>{icons[name]}</svg>;
}

const ROWS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const SEATS_PER_ROW = 10;

const bookedSeats = new Set([
  "A-4", "A-5", "B-3", "B-4", "C-7",
  "D-2", "D-3", "E-8", "F-5", "F-6",
  "G-2", "G-9", "H-4",
]);

export default function SeatSelection() {
  const navigate = useNavigate();
  const { booking, updateBooking } = useBooking();

  const [selectedSeats, setSelectedSeats] = useState(
    booking?.seats || []
  );

  const movie = booking?.movie;
  const ticketPrice = Number(movie?.price || 200);
  const subtotal = selectedSeats.length * ticketPrice;
  const convenienceFee = selectedSeats.length
    ? Math.round(subtotal * 0.02)
    : 0;
  const total = subtotal + convenienceFee;

  const toggleSeat = (seatId) => {
    if (bookedSeats.has(seatId)) return;

    setSelectedSeats((previous) => {
      if (previous.includes(seatId)) {
        return previous.filter((seat) => seat !== seatId);
      }

      if (previous.length >= 8) return previous;

      return [...previous, seatId];
    });
  };

  const confirmBooking = () => {
    if (!movie || selectedSeats.length === 0) return;

    const bookingId = `CV${Date.now().toString().slice(-8)}`;

    updateBooking({
      movie,
      theatre: booking?.theatre,
      date: booking?.date,
      showtime: booking?.showtime,
      seats: selectedSeats,
      bookingId,
    });

    navigate("/booking/confirmation");
  };

  if (!movie) {
    return (
      <main className="page-container flex min-h-[70vh] items-center justify-center py-16">
        <div className="glass-card w-full max-w-lg rounded-3xl p-8 text-center sm:p-12">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-300">
            <SeatIcon name="ticket" size={30} />
          </div>

          <h1 className="font-['Space_Grotesk'] text-2xl font-bold">
            Choose a movie first
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Select a movie and showtime before choosing your seats.
          </p>

          <Link
            to="/movies"
            className="gradient-button mt-7 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white"
          >
            Browse movies <SeatIcon name="arrow" size={17} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container min-h-screen py-10 sm:py-14">
      <div className="mb-8">
        <Link
          to={`/movie/${movie.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <SeatIcon name="back" size={18} />
          Back to movie
        </Link>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-violet-300">
          Complete your booking
        </p>

        <h1 className="font-['Space_Grotesk'] text-3xl font-bold sm:text-4xl">
          Select your seats
        </h1>

        <p className="mt-3 text-sm text-gray-400">
          {movie.title}
          {booking?.date ? ` · ${booking.date}` : ""}
          {booking?.showtime ? ` · ${booking.showtime}` : ""}
        </p>

        {booking?.theatre?.name && (
          <p className="mt-1 text-sm text-gray-500">
            {booking.theatre.name}
            {booking.theatre.location ? ` · ${booking.theatre.location}` : ""}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_320px]">
        {/* Seat map */}
        <section className="min-w-0 rounded-3xl border border-white/10 bg-[#14121f] p-4 sm:p-7">
          <div className="mx-auto max-w-2xl">
            <div className="mb-12">
              <div className="relative mx-auto h-12 w-full max-w-xl">
                <div className="absolute inset-x-5 top-0 h-10 rounded-[50%] border-t-4 border-violet-400/80 shadow-[0_-8px_35px_rgba(139,92,246,0.2)]" />
                <div className="absolute inset-x-0 top-7 text-center text-[10px] font-bold uppercase tracking-[0.35em] text-gray-500">
                  <SeatIcon name="screen" size={13} /> Cinema screen
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {ROWS.map((row) => (
                <div
                  key={row}
                  className="grid grid-cols-[18px_repeat(10,minmax(0,1fr))] items-center gap-1.5 sm:grid-cols-[24px_repeat(10,minmax(0,1fr))] sm:gap-2"
                >
                  <span className="text-center text-[10px] font-semibold text-gray-500 sm:text-xs">
                    {row}
                  </span>

                  {Array.from({ length: SEATS_PER_ROW }, (_, index) => {
                    const seatNumber = index + 1;
                    const seatId = `${row}-${seatNumber}`;
                    const isBooked = bookedSeats.has(seatId);
                    const isSelected = selectedSeats.includes(seatId);

                    return (
                      <button
                        key={seatId}
                        type="button"
                        disabled={isBooked}
                        onClick={() => toggleSeat(seatId)}
                        aria-label={`Row ${row}, seat ${seatNumber}${isBooked ? ", booked" : isSelected ? ", selected" : ", available"}`}
                        aria-pressed={isSelected}
                        className={`flex aspect-square min-w-0 items-center justify-center rounded-t-lg rounded-b-sm border text-[9px] font-bold transition duration-150 sm:text-[11px] ${
                          isBooked
                            ? "cursor-not-allowed border-gray-700 bg-gray-700/50 text-gray-500"
                            : isSelected
                              ? "scale-105 border-violet-300 bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]"
                              : "border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:border-emerald-300 hover:bg-emerald-500/25"
                        }`}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-3 border-t border-white/10 pt-6 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-emerald-500/50 bg-emerald-500/10" />
                Available
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-violet-300 bg-violet-500" />
                Selected
              </span>
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded border border-gray-700 bg-gray-700/50" />
                Booked
              </span>
            </div>
          </div>
        </section>

        {/* Booking summary */}
        <aside className="rounded-3xl border border-white/10 bg-[#14121f] p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-['Space_Grotesk'] text-xl font-bold">
            Booking summary
          </h2>

          <div className="mt-5 flex gap-4">
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="h-24 w-16 shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h3 className="font-semibold">{movie.title}</h3>
              <p className="mt-2 text-xs text-gray-500">
                {movie.duration} · {movie.language}
              </p>
              <p className="mt-2 text-sm font-semibold text-violet-300">
                ₹{ticketPrice} / seat
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-gray-400">Selected seats</span>
              <span className="text-right font-semibold">
                {selectedSeats.length
                  ? selectedSeats.join(", ")
                  : "None selected"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Tickets</span>
              <span>{selectedSeats.length}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Ticket subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">Convenience fee</span>
              <span>₹{convenienceFee}</span>
            </div>

            <div className="flex justify-between border-t border-white/10 pt-4 text-base font-bold">
              <span>Total</span>
              <span className="text-violet-300">₹{total}</span>
            </div>
          </div>

          {selectedSeats.length >= 8 && (
            <p className="mt-4 text-xs text-amber-300">
              Maximum 8 seats per booking.
            </p>
          )}

          <button
            type="button"
            onClick={confirmBooking}
            disabled={selectedSeats.length === 0}
            className="gradient-button mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirm booking
            <SeatIcon name="arrow" size={18} />
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-gray-500">
            Demo booking only. No real payment is collected.
          </p>
        </aside>
      </div>
    </main>
  );
}
