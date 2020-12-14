var mongoose    = require("mongoose");

var movies = new mongoose.Schema({
 movieParm: {
                    movieId: String,
                    movieName: String,
                    image: String,
                    rating: String,
                    overview: String,
                    homepageURL: String
            }
});


module.exports = mongoose.model("Movie", movies);