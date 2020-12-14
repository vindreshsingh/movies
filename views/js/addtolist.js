var mongoose        = require("mongoose"),
    moviesLists     = require("../../models/moviesmasterlist"),
    movieRecord     = require("../../models/movie"),
    MovieDB         = require('moviedb')("6bf903d885f2348c1ed94952f526a12d");
    
    
    

function addToMovieList(listname, movieID, userID, userName){
        moviesLists.findOne(
            {
                name: listname
            }).where('author.id').equals(userID).exec(function(err, movieList){
                // console.log("MovieList " + JSON.stringify(movieList) + "Author ID " + userID);
            if(movieList === null){
                createNewList(listname,movieID, userID, userName);
            }
            else if((err === null) && (movieList.author.id.equals(userID))){
                // console.log(movieList);
                addToExistingList(listname,movieID, userID, userName);
            }
            else{
                createNewList(listname,movieID, userID, userName);
            }
        });
}

function createNewList(listname, movieID, userID, userName){
    var author = {
                    id: userID,
                    username: userName
    }
    moviesLists.create({name: listname, author:author}, function(err, movieList){
    if(err)
       console.log(err);
    else{
            MovieDB.movieInfo({id: Number(movieID)}, function(err, res){
                if(err)
                    console.log(err);
                else{
                    var movie = JSON.parse(JSON.stringify(res));
                    // console.log("After JSON call " , movie);
                    var movieparm = {
                        movieId      : movie.id,
                        movieName    : movie.original_title,
                        image        : movie.poster_path,
                        rating       : movie.rating,
                        overview     : movie.overview,
                        homepageURL  : movie.homepage
                    }
                    
                    movieRecord.create({movieParm : movieparm}, function(err, newMovie){
                        // console.log("Here 5");
                        if(err)
                            console.log(err);
                        else{
                            newMovie.save();
                            // movieList.save();
                            movieList.movies.push(newMovie);
                            movieList.save();
                            // console.log(JSON.stringify(movieList));

                        }
                    });
            }
        });
    }
});
}

function addToExistingList(listname, movieID, userID, userName){
    // console.log("Here");
    MovieDB.movieInfo({id: Number(movieID)}, function(err, res){
        // console.log("Here 3");
        if(err)
            console.log(err);
        else{
            // console.log("Here 4", res);
            var movie = JSON.parse(JSON.stringify(res));
            // console.log("After JSON call " , movie);
            var movieparm = {
                movieId      : movie.id,
                movieName    : movie.original_title,
                image        : movie.poster_path,
                rating       : movie.rating,
                overview     : movie.overview,
                homepageURL  : movie.homepage
            }
            movieRecord.create({movieParm : movieparm}, function(err, newMovie){
                if(err)
                    console.log(err);
                else{
                    newMovie.save();
                    
                    moviesLists.findOne({name:listname}).where('author.id').equals(userID).exec(function(err, movieList){
                    // moviesLists.findOne({name:listname}).exec(function(err, movieList){
                             if(err)
                                console.log(err);
                             else{
                                movieList.movies.push(newMovie);
                                movieList.save();
                             }
                        });
                }
            });
        }
    });
}

module.exports = addToMovieList;