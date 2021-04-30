const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
    if (review) {
        res.locals.review = review;
        return next();
    }

    next({status: 404, message: "Review cannot be found."})
}

async function destroy(req, res, next) {
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
}

async function hasProps(req, res, next) {
    const {data} = req.body;
    if ((data.content && data.score) || (data.content && !data.score) || (!data.content && data.score)) {
        res.locals.reviewUpdate = data;
        return next();
    }

    next({status: 400, message: "The update must include score and/or content properties."})
}

async function update(req, res, next) {
    const reviewUpdate = {...res.locals.review, ...res.locals.reviewUpdate};
    const data = await service.update(reviewUpdate);

    res.json({data})
}



module.exports = {
    destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
    update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(hasProps), asyncErrorBoundary(update)],
}