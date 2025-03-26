const express = require("express");
const path = require("path");
const movieRoutes = require("./server/routes/movies");
const rentalRoutes = require("./server/routes/rentals");
const authRoutes = require("./server/routes/auth");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 4000;
const corsOptions = {
  origin: "http://localhost:4000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());

app.use("/api/movies", movieRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
