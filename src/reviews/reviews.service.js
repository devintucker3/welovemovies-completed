const knex = require("../db/connection");


function read(review_id) {
    return knex("reviews").select("*").where({review_id}).first();
}

function destroy(review_id) {
    return knex("reviews").where({review_id}).del();
}

async function _criticReview(review) {
    const critic = await knex("critics")
        .select("*")
        .where({critic_id: review.critic_id})
        .then(critic => {
            review.critic = critic[0]
            return review
        })
    return critic;
}

function update(reviewUpdate) {
    return knex("reviews")
        .where({review_id: reviewUpdate.review_id})
        .update(reviewUpdate, "*")
        .then(() => Promise.resolve(_criticReview(reviewUpdate)))
}

module.exports = {read, destroy, update};