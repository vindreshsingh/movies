var mongoose    = require("mongoose");
var movieparameter = require("./movie")


var moviesMasterList = new mongoose.Schema(
 {
  
    name: String,
    author:{
       id:{
           type: mongoose.Schema.Types.ObjectId,
           ref: "User"
        },
       username: String
    },
    movies: [{
                    type: mongoose.Schema.Types.ObjectId,
                    ref : "Movie"
    }]
 }
);

moviesMasterList.post('remove', function(movieList) {
   movieparameter.remove({
      _id: {
        $in: movieList.movies
      }
    }).exec();
});

module.exports = mongoose.model("MovieList", moviesMasterList);