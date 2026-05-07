import { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);

useEffect(() => {
  fetch("/api/movies")
    .then(res => res.json())
    .then(data => {
      console.log("API RESPONSE:", data);
      setMovies(data.data);
    })
    .catch(err => console.error(err));
}, []);

return ( <div> <h1>Movies</h1> {movies.map((movie) => ( <div key={movie._id}> <h3>{movie.title}</h3> <p>Director: {movie.director}</p> <p>Rating: {movie.rating}</p> </div> ))} </div> ); 
}

export default App;