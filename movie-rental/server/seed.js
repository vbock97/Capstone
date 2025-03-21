const db = require("./db");

const createUsersTable = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
  `;
  try {
    await db.query(createTableQuery);
    console.log("Users table created (or already exists)");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
};

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
    const checkMovieQuery = `
      SELECT * FROM movies WHERE title = $1;
    `;
    const checkMovieValues = [movie.title];

    try {
      const result = await db.query(checkMovieQuery, checkMovieValues);

      if (result.rows.length === 0) {
        const insertMovieQuery = `
          INSERT INTO movies (title, genre, director, release_year, rental_price)
          VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const insertMovieValues = [
          movie.title,
          movie.genre,
          movie.director,
          movie.release_year,
          movie.rental_price,
        ];

        const insertResult = await db.query(
          insertMovieQuery,
          insertMovieValues
        );
        console.log(`Movie added: ${insertResult.rows[0].title}`);
      } else {
        console.log(`Movie already exists: ${movie.title}`);
      }
    } catch (err) {
      console.error("Error seeding movie:", err);
    }
  }
};

const seedDatabase = async () => {
  await createUsersTable();
  await seedMovies();
};

seedDatabase();
