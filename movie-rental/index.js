const express = require("express");
const bodyParser = require("body-parser");
const movieRoutes = require("./routes/movies");
const rentalRoutes = require("./routes/rentals");

const app = express();
const PORT = 4000;

app.use(bodyParser.json());

app.use("/api/movies", movieRoutes);
app.use("/api/rentals", rentalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
