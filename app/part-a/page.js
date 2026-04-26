"use client";

/**
 * Part A: Cinema Ticket Booking Form
 *
 * Allows users to book cinema tickets by selecting a movie, showtime, and entering
 * their mobile number. Performs client-side validation before displaying confirmation.
 *
 * Server-side delivery: This page is delivered as HTML from the server, then hydrated
 * on the client for interactivity. The form validation runs in the browser.
 */

import { useState } from "react";
import Link from "next/link";

// Movie and showtime data - each movie has specific dates and times
const MOVIES_WITH_SHOWTIMES = [
  {
    id: "dune2",
    title: "Dune: Part Two",
    showtimes: [
      { id: "dune2-1", date: "25th March 2026", time: "14:00" },
      { id: "dune2-2", date: "25th March 2026", time: "18:30" },
      { id: "dune2-3", date: "26th March 2026", time: "12:00" },
    ],
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    showtimes: [
      { id: "opp-1", date: "25th March 2026", time: "16:00" },
      { id: "opp-2", date: "26th March 2026", time: "20:00" },
      { id: "opp-3", date: "27th March 2026", time: "14:30" },
    ],
  },
  {
    id: "wick",
    title: "John Wick: Chapter 4",
    showtimes: [
      { id: "wick-1", date: "25th March 2026", time: "19:00" },
      { id: "wick-2", date: "26th March 2026", time: "15:00" },
    ],
  },
];

// Irish mobile number regex: 08X XXXXXXX or +353 8X XXXXXXX
const MOBILE_REGEX = /^(\+353|0)8[5-9]\d{7}$/;

export default function PartAPage() {
  const [movieId, setMovieId] = useState("");
  const [showtimeId, setShowtimeId] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [booking, setBooking] = useState(null);

  // Get showtimes for the selected movie
  const selectedMovie = MOVIES_WITH_SHOWTIMES.find((m) => m.id === movieId);
  const availableShowtimes = selectedMovie ? selectedMovie.showtimes : [];

  /**
   * Validates the form inputs.
   * Returns an object of field names to error messages, or empty object if valid.
   */
  function validateForm() {
    const newErrors = {};

    if (!movieId) {
      newErrors.movie = "Please select a movie";
    }

    if (!showtimeId) {
      newErrors.showtime = "Please select a showtime";
    } else if (selectedMovie && !availableShowtimes.find((s) => s.id === showtimeId)) {
      newErrors.showtime = "Please select a valid showtime for this movie";
    }

    const trimmedMobile = mobile.trim();
    if (!trimmedMobile) {
      newErrors.mobile = "Please enter your mobile number";
    } else if (!MOBILE_REGEX.test(trimmedMobile.replace(/\s/g, ""))) {
      newErrors.mobile = "Please enter a valid Irish mobile number (e.g. 085 123 4567 or 0851234567)";
    }

    return newErrors;
  }

  /**
   * Handles form submission. Validates inputs and either shows errors or confirmation.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setBooking(null);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const showtime = availableShowtimes.find((s) => s.id === showtimeId);
    const movie = selectedMovie;

    setBooking({
      filmName: movie.title,
      date: showtime.date,
      showtime: showtime.time,
      mobile: mobile.trim(),
    });
  }

  return (
    <div className="form-container">
      <nav>
        <ul>
          <li><Link href="/">Home</Link></li>
          <li><Link href="/part-a">Part A - Cinema Booking</Link></li>
          <li><Link href="/part-b-c">Part B & C - Appliance Inventory</Link></li>
        </ul>
      </nav>

      <h1>Cinema Ticket Booking</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="movie">Movies</label>
          <select
            id="movie"
            value={movieId}
            onChange={(e) => {
              setMovieId(e.target.value);
              setShowtimeId("");
              setErrors((prev) => ({ ...prev, movie: null, showtime: null }));
            }}
            className={errors.movie ? "error" : ""}
          >
            <option value="">Select a movie</option>
            {MOVIES_WITH_SHOWTIMES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
          {errors.movie && <p className="error-message">{errors.movie}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="showtime">Showtimes</label>
          <select
            id="showtime"
            value={showtimeId}
            onChange={(e) => {
              setShowtimeId(e.target.value);
              setErrors((prev) => ({ ...prev, showtime: null }));
            }}
            disabled={!movieId}
            className={errors.showtime ? "error" : ""}
          >
            <option value="">Select a showtime</option>
            {availableShowtimes.map((s) => (
              <option key={s.id} value={s.id}>
                {s.date} at {s.time}
              </option>
            ))}
          </select>
          {errors.showtime && <p className="error-message">{errors.showtime}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile</label>
          <input
            id="mobile"
            type="tel"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              setErrors((prev) => ({ ...prev, mobile: null }));
            }}
            placeholder="085 123 4567"
            maxLength={14}
            className={errors.mobile ? "error" : ""}
          />
          {errors.mobile && <p className="error-message">{errors.mobile}</p>}
        </div>

        <button type="submit" className="btn btn-primary">
          Book Tickets
        </button>
      </form>

      {booking && (
        <div className="message success">
          Your booking for {booking.filmName} on {booking.date} at {booking.showtime} has been
          confirmed. A confirmation text has been sent to {booking.mobile}.
        </div>
      )}
    </div>
  );
}
