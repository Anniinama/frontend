import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
const IMAGE_BASE = "http://localhost:3000";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("none");
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const moviesPerPage = 6;

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(data.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(saved);
  }, []);

  const toggleFavorite = (movie) => {
    let updated;

    if (favorites.find((f) => f._id === movie._id)) {
      updated = favorites.filter((f) => f._id !== movie._id);
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const filtered = movies
    .filter((m) =>
      m.title.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  // pagination logic
  const start = (page - 1) * moviesPerPage;
  const paginated = filtered.slice(start, start + moviesPerPage);

  const totalPages = Math.ceil(filtered.length / moviesPerPage);

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      {/* HEADER */}
      <header className="header">
        <h1>🎬 Movie Dashboard</h1>

        <div className="controls">
          <input
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSort(e.target.value)}>
            <option value="none">Sort</option>
            <option value="rating">Highest Rating</option>
          </select>

          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* GRID */}
      <div className="grid">
        {paginated.map((movie) => (
          <motion.div
          key={movie._id}
          className="card"
          whileHover={{ scale: 1.05 }}
          onClick={() => setSelectedMovie(movie)}
        >
          <img
            src={`${IMAGE_BASE}${movie.image}`}
            alt={movie.title}
            className="poster"
          />

          <div className="card-info">
            <h2>{movie.title}</h2>
            <p>🎬 {movie.director}</p>
            <p>⭐ {movie.rating}</p>

            {movie.watched && <span className="badge">Watched</span>}
          </div>
        </motion.div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} / {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      {selectedMovie ? (
        <div
          className="modal-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <img
              src={
                selectedMovie.image
                  ? `${IMAGE_BASE}${selectedMovie.image}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={selectedMovie.title}
              className="modal-image"
            />

            <h2>{selectedMovie.title}</h2>

            <p><b>Director:</b> {selectedMovie.director}</p>
            <p><b>Release:</b> {selectedMovie.releaseDate}</p>
            <p><b>Rating:</b> ⭐ {selectedMovie.rating}</p>

            <p>
              <b>Genres:</b>{" "}
              {selectedMovie.genres
                ? selectedMovie.genres.join(", ")
                : "N/A"}
            </p>

            <p className="description">
              {selectedMovie.description}
            </p>

            <p>
              <b>Watched:</b>{" "}
              {selectedMovie.watched ? "Yes ✅" : "No ❌"}
            </p>

            <button onClick={() => setSelectedMovie(null)}>
              Close
            </button>

          </div>
        </div>
      ) : null}
    </div>
  );

}

export default App;