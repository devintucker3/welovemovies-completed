const knex = require("../db/connection");

function _listMoviesShowing() {
    return knex("movies")
        .join("movies_theaters", "movies_theaters.movie_id", "movies.movie_id")
        .select("movies.*", "movies.movie_id")
        .where({is_showing: true})
        .groupBy("movies.movie_id");
}

function list(isShowing) {
    if (isShowing) {
        return _listMoviesShowing(); 
    }
    
    return knex("movies").select("*");
}

function read(movieId) {
    return knex("movies").select("*").where({movie_id: movieId}).first();
}

async function _critic(review) {
    const critic = await knex("critics")
        .select("*")
        .where({critic_id: review.critic_id})
        .then(critic => {
            review.critic = critic[0]
            return review
        })
    return critic;
}

function listReviews(movieId) {
    return knex("reviews")
        .select("*")
        .where({movie_id: movieId})
        .then(reviews => {
            const criticReviews = reviews.map(_critic)
            return Promise.all(criticReviews)
        });
}


module.exports = {list, read, listReviews};