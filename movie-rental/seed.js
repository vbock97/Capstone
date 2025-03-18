const db = require("./db");

const seedMovies = async () => {
  const movies = [
    {
      title: "The Shawshank Redemption",
      genre: "Drama",
      director: "Frank Darabont",
      release_year: 1994,
      rental_price: 5.0,
    },
    {
      title: "The Godfather",
      genre: "Crime",
      director: "Francis Ford Coppola",
      release_year: 1972,
      rental_price: 4.0,
    },
    {
      title: "The Dark Knight",
      genre: "Action",
      director: "Christopher Nolan",
      release_year: 2008,
      rental_price: 6.0,
    },
  ];

  for (const movie of movies) {
    const query = `
      INSERT INTO movies (title, genre, director, release_year, rental_price)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [
      movie.title,
      movie.genre,
      movie.director,
      movie.release_year,
      movie.rental_price,
    ];

    try {
      const result = await db.query(query, values);
      console.log(`Movie added: ${result.rows[0].title}`);
    } catch (err) {
      console.error("Error seeding movie:", err);
    }
  }
};

seedMovies();
