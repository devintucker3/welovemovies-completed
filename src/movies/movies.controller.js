const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res, next) {
    const isShowing = req.query.is_showing === "true"
    const movies = await service.list(isShowing);

    res.json({data: movies})
}

async function movieExists(req, res, next) {
    const {movieId} = req.params;
    const movie = await service.read(movieId);
    if (movie) {
        res.locals.movie = movie;
        return next();
    }
    console.log("movie", movie)
    //next({status: 404, message: `Movie cannot be found.`});
    res.status(404).json({error: "Movie cannot be found."});
}

async function read(req, res, next) {
    res.json({data: res.locals.movie});
}

async function listReviews(req, res, next) {
    const {movieId} = req.params
    const reviews = await service.listReviews(Number(movieId));
    res.json({data: reviews})
}

module.exports = {
    list: [asyncErrorBoundary(list)],
    read: [asyncErrorBoundary(movieExists), read],
    listReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(listReviews)],
    movieExists
}