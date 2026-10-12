import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const BookingContext = createContext(null);
const STORAGE_KEY = "cineverse-booking";

const createInitialBooking = () => ({
  movie: null,
  movieId: "",
  theatre: null,
  date: "",
  showtime: "",
  seats: [],
  bookingId: "",
});

function loadBooking() {
  if (typeof window === "undefined") {
    return createInitialBooking();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return createInitialBooking();

    const parsed = JSON.parse(saved);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return createInitialBooking();
    }

    return {
      ...createInitialBooking(),
      ...parsed,
      movie:
        parsed.movie && typeof parsed.movie === "object"
          ? parsed.movie
          : null,
      movieId:
        parsed.movieId ||
        parsed.movie?.id ||
        "",
      seats: Array.isArray(parsed.seats)
        ? [...new Set(parsed.seats.filter((seat) => typeof seat === "string"))]
        : [],
    };
  } catch (error) {
    console.error("Unable to load Cineverse booking:", error);
    return createInitialBooking();
  }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(loadBooking);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
    } catch (error) {
      console.error("Unable to save Cineverse booking:", error);
    }
  }, [booking]);

  // Update booking fields without losing previously selected details.
  const updateBooking = useCallback((updates) => {
    if (!updates || typeof updates !== "object") return;

    setBooking((current) => {
      const next = {
        ...current,
        ...updates,
        seats:
          updates.seats !== undefined
            ? Array.isArray(updates.seats)
              ? [...new Set(updates.seats)]
              : []
            : current.seats,
      };

      if (updates.movie && typeof updates.movie === "object") {
        next.movieId = updates.movie.id ?? current.movieId;
      } else if (updates.movieId !== undefined) {
        next.movieId = updates.movieId;
      }

      return next;
    });
  }, []);

  // Supports both startBooking(movie) and startBooking(bookingDetails).
  const startBooking = useCallback((selection) => {
    if (!selection || typeof selection !== "object") return;

    const isBookingDetails =
      Object.prototype.hasOwnProperty.call(selection, "movie");

    const movie = isBookingDetails ? selection.movie : selection;

    if (!movie || typeof movie !== "object" || movie.id == null) return;

    setBooking({
      ...createInitialBooking(),
      ...(isBookingDetails ? selection : {}),
      movie,
      movieId: movie.id,
      theatre: isBookingDetails ? selection.theatre ?? null : null,
      date:
        isBookingDetails && selection.date
          ? selection.date
          : new Date().toLocaleDateString("en-CA"),
      showtime: isBookingDetails ? selection.showtime ?? "" : "",
      seats:
        isBookingDetails && Array.isArray(selection.seats)
          ? [...new Set(selection.seats)]
          : [],
      bookingId: isBookingDetails ? selection.bookingId ?? "" : "",
    });
  }, []);

  // Select or deselect seats, with a maximum of eight tickets.
  const toggleSeat = useCallback((seat) => {
    if (typeof seat !== "string" || !seat.trim()) return;

    setBooking((current) => {
      if (!current.movie) return current;

      const seats = Array.isArray(current.seats)
        ? current.seats
        : [];

      if (seats.includes(seat)) {
        return {
          ...current,
          seats: seats.filter((item) => item !== seat),
        };
      }

      if (seats.length >= 8) return current;

      return {
        ...current,
        seats: [...seats, seat],
      };
    });
  }, []);

  const resetBooking = useCallback(() => {
    setBooking(createInitialBooking());

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Unable to clear Cineverse booking:", error);
    }
  }, []);

  return (
    <BookingContext.Provider
      value={{
        booking,
        updateBooking,
        startBooking,
        toggleSeat,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBooking must be used inside BookingProvider");
  }

  return context;
}