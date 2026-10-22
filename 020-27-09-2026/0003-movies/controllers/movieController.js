const movieModel = require("../models/movieModel");

const index = (req, res) => {
    movieModel.index()
        .then(movies => {
            res.render("pages/movies/index", { movies });
        });
}

const moviesSearch = (req, res) => {
    const partOfMovieTitle = req.query.partOfMovieTitle;
    movieModel.moviesSearch(partOfMovieTitle)
        .then(movies => {
            res.render("pages/movies/index", { movies });
        });
}


module.exports = {
    index,
    moviesSearch,
}