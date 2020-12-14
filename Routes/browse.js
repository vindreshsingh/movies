var express               = require("express");
var MovieDB               = require('moviedb')("6bf903d885f2348c1ed94952f526a12d");
var async                 = require("async");
var moviesLists           = require("../models/moviesmasterlist");
var router                = express.Router();


// =================================================
//        Display Popular Movies - Default Route
// =================================================

router.get("/:id", function(req, res){
    // console.log("Request details 3 " + req);
    var movieLists = [];
    var pageNumbers = [];
    var movieID = "";
    var movieInfo = new Array();
    var parms = "popularity.desc";
    pageNumbers.push(req.params.id);
    
    async.each(pageNumbers, function(page, callback){
        MovieDB.discoverMovie({sort_by: parms,page:page}, function(err,res){
            if(err || (res.results.length < 1)) { //Checks for empty results
                callback(new Error('Empty results'));
            }
            else{
                    res.results.forEach(function(result){
                        var resultItem = result;
                        movieID = res.id
                        movieInfo.push(resultItem);
                    });
                    callback();
            }
        });
    }, function(err){
        if(err){
             //Need to Render - No more results Page
             console.log(err);
        }
        else{
        //   console.log("Page Number " + req.params.id);
           async.series([
               function(callback){
                moviesLists.find({},(function(err, docs) {
                if(err)
                {
                    console.log(err);
                    callback();
                }
                    
                else{
                    // console.log("Length of Array", docs);
                    docs.forEach(function(doc){
                        var movieInfo = {
                            id: String,
                            name: String
                        }
                        movieInfo.id = doc._id;
                        movieInfo.name = doc.name; 
                        //Authenticate 
                        if((req.user) && (req.user._id.equals(doc.author.id)))
                                movieLists.push(movieInfo);
                        // console.log(movieLists);
                });
                    callback();
                }
                
                }));  
               }
               ], 
               function(err){
                   if(err)
                        console.log(err);
                   else{
                        // console.log(movieLists);
                        res.render("./movie-explorer/index", {moviesInfo : movieInfo, page: req.params.id, movieLists:movieLists, movieID: movieID});
                   }
               });
        } 
    });
});



// ==============================================
//        Display - Getting Movie based on Genre
// ==============================================

router.get("/:pageID/:genreID", function(req,res){
    // console.log("Request details 4 " + req);
    var movieLists = [];
    var pageNumbers = [];
    var movieInfo = new Array();
    pageNumbers.push(req.params.pageID);
    
    async.eachSeries(pageNumbers, function(page, callback){
        MovieDB.genreMovies({ id: req.params.genreID, page:page,adult:false}, function(err,res){
            if(err || (res.results.length < 1)) { //Checks for empty results
                callback(new Error('Empty results'));
            }
            else{
                    res.results.forEach(function(result){
                        if(result.adult == false){
                            var resultItem = result;
                            movieInfo.push(resultItem);
                        }
                    });
                    callback();
            }
        });
    }, function(err){
        if(err){
             //Need to Render - No more results Page
             console.log(err);
        }
        else{
               async.series([
               function(callback){
                moviesLists.find({},(function(err, docs) {
                if(err)
                {
                    console.log(err);
                    callback();
                }
                    
                else{
                    
                    docs.forEach(function(doc){
                        var movieInfo = {
                            id: String,
                            name: String
                        }
                        movieInfo.id = doc._id;
                        movieInfo.name = doc.name;
                        if((req.user) && (req.user._id.equals(doc.author.id)))
                            movieLists.push(movieInfo);
                        // console.log(movieLists);
                })
                    callback();
                    
                }
                
                }));  
               }
               ],
               function(err){
                   if(err)
                        console.log(err);
                   else 
                     res.render("./movie-explorer/index", {moviesInfo : movieInfo, page: req.params.pageID, genre: req.params.genreID, movieLists: movieLists});   
               });
        } 
    });
});

module.exports = router;