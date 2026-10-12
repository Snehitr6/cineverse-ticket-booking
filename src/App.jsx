import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import BookingConfirmation from "./pages/BookingConfirmation";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function NotFound() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center px-5 text-center text-white">
      <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-violet-400">
        404 · Page not found
      </p>

      <h1 className="text-4xl font-black sm:text-6xl">
        Lost in the cinema?
      </h1>

      <p className="mt-4 max-w-md text-sm leading-6 text-gray-400">
        This page doesn't exist or may have moved. Return home to discover
        your next movie.
      </p>

      <a
        href="/"
        className="mt-7 rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-500"
      >
        Back to Home
      </a>
    </section>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/booking/seats" element={<SeatSelection />} />
        <Route
          path="/booking/confirmation"
          element={<BookingConfirmation />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#09090f] text-white">
      <Navbar />

      <main className="min-h-[70vh]">
        <AnimatedRoutes />
      </main>

      <Footer />
    </div>
  );
}