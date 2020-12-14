var express               = require("express");
var async                 = require("async");
var moviesLists           = require("../models/moviesmasterlist");
var movieRecord           = require("../models/movie");
var router                = express.Router();
var middleware            = require("../middleware");


//
// ======================================================
//              Display List based on a page ID:
// ======================================================
router.get("/:pageID", function(req, res){
    
    if(req.user){
      moviesLists.find({'author.id' : req.user._id},function(err, movieList){
      if(err)
            console.log(err);
      else{
          async.series([
                 function(callback){
                     async.eachSeries(movieList, function(movieList, callback){
                         if(movieList.movies.length <= 0){
                             moviesLists.findByIdAndRemove({_id:movieList._id}, function(err){
                                 callback();
                             });
                         }
                         else{
                            callback();    
                         }
                     }, 
                     
                     function(){
                         callback();
                     });
                 }    
              ], function(){
                    var pages = Number(movieList.length / 9);
                    var startLimit = 0;
                    var endLimit = 0;
                    pages = Math.ceil(pages);
                    moviesLists.find({'author.id' : req.user._id},function(err, movieList){
                      if(req.params.pageID == 1){
                          startLimit = 0;
                          endLimit = 8;
                      }
                      else{
                          startLimit = (req.params.pageID * 9) - 10;
                          endLimit = (req.params.pageID * 9) - 1;
                      }
                      res.render("./lists/index",{startLimit: startLimit, endLimit: endLimit, totalListLength: movieList.length, moviesLists: movieList, totalPages:pages, currentPage: req.params.pageID});
                      
                    });
              })
            }
        });
    }
    else{
        res.redirect("/login");
    }
});
// ================================================
//              Show the Movies
// ================================================
router.get("/show/:listID", middleware.isLoggedIn , middleware.checkListOwnershipviaID, function(req, res){
    
    
    var moviesInfoArr = [];
    // console.log("Route Invoked");
    async.series([
        function(outercallback){
            async.series([
                
                function(callback1){
                    moviesLists.findById(req.params.listID).populate('movies').exec(function(err, movieList){
                    // console.log("Here1");
                    var moviesObject = movieList.movies;
                        async.eachSeries(moviesObject, function(movieID, callback2){   
                            
                            async.series([
                                
                                function(callback3){
                                //  console.log("Here2");
                                   movieRecord.findById(movieID, function(err, movieInfo){
                                       moviesInfoArr.push(movieInfo);
                                       callback3();
                                   }); 
                                }     
                            ],
                            
                            function(err){
                                callback2();
                            });
                                 
                        }, function(err){
                            callback1();
                        });
            });
                    
        }], function(err){
            outercallback();
        });
        }],
        
        function(err){
            // console.log(moviesInfoArr); 
            res.render("./lists/show", {listID: req.params.listID, moviesInfoArr:moviesInfoArr});
        });
        
    });

// ============================================================
//             Deleting particular movie from the list
// ============================================================
    
router.delete("/:listID/:movieID", middleware.isLoggedIn , middleware.checkListOwnershipviaID, function(req,res){
    // console.log("Id's" + req.params.listID + "," + req.params.movieID);
    movieRecord.findByIdAndRemove(req.params.movieID, function(err, movie){
        if(err)
            res.redirect("back");
        else {
            
            moviesLists.update({ _id: req.params.listID}, {$pull: {movies: req.params.movieID}}, function(err, data){
                if(err) {
                    console.log(err);
                }
                else{
                        // console.log(data);
                        moviesLists.findById(req.params.listID, function(err, moviesList){
                        var moviesArray = moviesList.movies;
                        // console.log(moviesArray);
                        if(moviesArray.length > 0)
                            res.redirect("/list/show/" + req.params.listID );
                        else
                            res.redirect("/list/1"); //First page of the list
                    });
                }
            });
              
        }   
            
    });
});

module.exports = router;