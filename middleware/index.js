var moviesLists           = require("../models/moviesmasterlist");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req,res,next){
   if(req.isAuthenticated()){
      return next();
   }
   req.flash("error", "You must be logged in");
   res.redirect("/login");
}



middlewareObj.checkListOwnershipviaName = function(req,res,next){
    if(req.isAuthenticated()){
        moviesLists.findOne({name: req.params.listId}).where('author.id').equals(req.params.userID).exec(function(err, movieList){
            if(err){
                req.flash("error", "You are not authorized - It's not the list you own.");
                res.redirect("back");
            }
            else{
                if(movieList == null){
                    next();
                }
                else if((movieList != null) && movieList.author.id.equals(req.user._id)){
                   next();
                }
                else{
                   req.flash("error", "You are not authorized - It's not the list you own.");
                   res.redirect("back");
                }
            }
        });
    }
    else{
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    }
}

middlewareObj.checkListOwnershipviaID = function(req,res,next){
    if(req.isAuthenticated()){
        moviesLists.findById(req.params.listID, function(err, movieList){
            if(err){
                req.flash("error", "You are not authorized - It's not the list you own.");
                res.redirect("back");
            }
                
            else{
                if(movieList.author.id.equals(req.user._id)){
                   next();
                }
                else{
                   req.flash("error", "You are not authorized - It's not the list you own.");
                   res.redirect("back");
                }
         }
        });
    }
    else{
        req.flash("error", "You must be logged in");
        res.redirect("/login");
    }
}





module.exports = middlewareObj;