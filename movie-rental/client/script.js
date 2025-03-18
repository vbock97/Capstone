const movieList = document.getElementById("movie-list");

const fetchMovies = async () => {
  try {
    const response = await fetch("http://localhost:4000/api/movies");
    const movies = await response.json();

    movieList.innerHTML = "";
    movies.forEach((movie) => {
      const movieItem = document.createElement("li");
      movieItem.textContent = `${movie.title} (${movie.release_year}) - $${movie.rental_price}`;
      movieList.appendChild(movieItem);
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
};

const addMovieForm = document.getElementById("add-movie-form");
addMovieForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const movieData = {
    title: document.getElementById("title").value,
    genre: document.getElementById("genre").value,
    director: document.getElementById("director").value,
    release_year: document.getElementById("release_year").value,
    rental_price: document.getElementById("rental_price").value,
  };

  try {
    const response = await fetch("http://localhost:4000/api/movies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(movieData),
    });

    const newMovie = await response.json();
    alert(`Movie added: ${newMovie.title}`);
    fetchMovies();
  } catch (error) {
    console.error("Error adding movie:", error);
  }
});

fetchMovies();
