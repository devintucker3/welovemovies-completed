if (process.env.USER) require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const moviesRouter = require("./movies/movies.router");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");
const cors = require("cors");
app.use(cors());


app.use("/movies", moviesRouter);
app.use("/theaters", theatersRouter);
app.use("/reviews", reviewsRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
