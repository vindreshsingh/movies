var express               = require("express");
var MovieDB               = require('moviedb')("6bf903d885f2348c1ed94952f526a12d");
var async                 = require("async");
var moviesLists           = require("../models/moviesmasterlist");
var router                = express.Router();


// ==========================================================
//        Search - Display movies relating to the search
// ==========================================================
router.get("/:query",function(req,res){
    //req.query
    var moviesInfo = [];
    var movieLists = [];
    
    async.series([
        
       function(callback){
          async.series([
            function(callback){
                MovieDB.searchMovie(req.query, function(err, res){
                 if(err){
                    // console.log(err);
                    callback(new Error("Not able to fetch Search results"));
                }
                 else{
                    // console.log("Response: " + JSON.stringify(res, null, 4));
                    async.series([
                            function(callback){
                                var searchResults = res.results;
                                if(searchResults.length < 1)
                                    callback(new Error("No results found"));
                
                                async.eachSeries(searchResults, function(movieInfo, callback){
                                        // console.log("Here");
                                        moviesInfo.push(movieInfo);
                                        callback();
                                }, function(){
                                    callback();
                                });
                            },
                            function(callback){
                                
                                moviesLists.find({},(function(err, docs) {
                                if(err)
                                {
                                    console.log(err);
                                    callback();
                                }
                                    
                                else{
                                // console.log("Length of Array", docs);
                                async.eachSeries(docs, function(doc,callback){
                                    var movieInfo = {
                                        id: String,
                                        name: String
                                    };
                                    movieInfo.id = doc._id;
                                    movieInfo.name = doc.name; 
                                    //Authenticate 
                                    // console.log("Here2");
                                    if((req.user) && (req.user._id.equals(doc.author.id))){
                                        movieLists.push(movieInfo);
                                    }
                                    callback();
                                }, function(){
                                    // console.log("Here 3");
                                    callback();
                                });
                                }
                                })); 
                                }
                        ], function(){
                            callback();
                        }); 
                    
                    }
                });
        }], 
        function(){
            callback();
        })
           ;
      }
    ] , 
    function(err){
        // console.log("Here");
        if(err)
            console.log(err);
        else{
            // console.log(moviesInfo);
            // console.log(movieLists);
            res.render("./movie-explorer/index",{moviesInfo : moviesInfo, movieLists:movieLists});
        }
    });
});

module.exports = router;
