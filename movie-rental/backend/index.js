const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const movieRoutes = require("./routes/movies");
const rentalRoutes = require("./routes/rentals");
const authRoutes = require("./routes/auth");
require("dotenv").config();

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, "client")));
app.use(bodyParser.json());

app.use("/api/movies", movieRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
