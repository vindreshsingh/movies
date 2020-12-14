var express               = require("express");
var MovieDB               = require('moviedb')("6bf903d885f2348c1ed94952f526a12d");
var async                 = require("async");
var router                = express.Router();

// ============================================================
//             Displaying a particular Movie
// ============================================================
router.get("/:movieID", function(req,res){
    // console.log("From here" + req.params.movieID);
    var similarMoviesInfo= [];
    var imagesInfo        = [];
    var videosInfo        = [];
    var movieInfo         = [];
    var imagesResult      = [];
    var videosResult      = [];
    var similarMovieList  = [];
    
    asyncLooper:
    async.series([
        function(outercallback){
        async.series([
        function(callback){
            MovieDB.movieImages({id: req.params.movieID}, function(req, res, err){
                if(res == null)
                   return callback(err,"New Error");
                // console.log(err);
                imagesResult = res.backdrops;
                return firstStep(callback);
                // callback();
            });
        },
        
        function(callback){
            MovieDB.movieVideos({id: req.params.movieID}, function(req, res, err){
                if(res == null)
                    return callback(err);
                videosResult = res.results;
                // console.log("Here");
                return secondStep(callback);
                // console.log("After");
                // callback();
            });
        },
        
        function(callback){
            MovieDB.movieSimilar({id: req.params.movieID}, function(req, res, err){
            if(res == null)
                return callback(err);
            similarMovieList = res.results;
            return thirdStep(callback);
            // callback();
            });
        },
        
        function(callback4){
            MovieDB.movieInfo({id: req.params.movieID}, function(req, res){
                // console.log(res);
                movieInfo.push(res);
                // console.log("Call back 4 invoked");
                // return callback4();
                return callback4(true);
            });
        }
        
        ], function(err){
            //res.render here
            // console.log("Final outercallback");
            outercallback(null);
            // return;
        });
        }], 
        function(err){
            // console.log("Similar Movies Info " + JSON.stringify(similarMoviesInfo));
            // console.log("Images Info " + JSON.stringify(imagesInfo));
            // console.log("Videos Info " + JSON.stringify(videosInfo));
            // console.log("Movies Info " + JSON.stringify(movieInfo));
            res.render("./movie/index", {movieInfo: movieInfo, imagesInfo: imagesInfo, videosInfo: videosInfo, similarMoviesInfo: similarMoviesInfo});  
            
        });

        
        
        function firstStep(theCallBack){
            async.each(imagesResult, function(imageResult, callback1_1){
            async.series([
                    function(callback1_2){
                        imagesInfo.push(imageResult);
                        // console.log("callback 1_2");
                        callback1_2();
                        return;
                    }
                
                ], function(err){
                    // console.log("callback 1_1");
                    callback1_1();
                    return;
                });
            
            }, 
            function(err){
                // console.log("callback 1");
                return theCallBack(null);
            });
        }
        
        function secondStep(theCallBack){
            async.each(videosResult, function(videoInfo, callback2_1){
                async.series([
                          function(callback2_2){
                              videosInfo.push(videoInfo);
                            //   console.log("Callback 2.2");
                              callback2_2();
                              return;
                          }    
                       ], function(err){
                        //   console.log("Callback 2.1");
                           callback2_1();
                           return;
                       })
                   
               }, function(err){
                //   console.log("Call back 2 invoked");
                   return theCallBack(null);
               });
        }
        
        function thirdStep(callback){
            async.each(similarMovieList, function(movie, callback3_1){   
            async.series([
                function(callback3_2){
                //  console.log("Here2");
                       if(movie.adult == false) similarMoviesInfo.push(movie);
                       callback3_2();
                       return;
                }     
            ],
            function(err){
                callback3_1();
                return;
            });
                 
        }, function(err){
                // console.log("Call back 3 invoked");
                return callback(null);
            });
        }
});

module.exports = router;