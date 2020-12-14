var express               = require("express");
var addToMovieList        = require("../views/js/addtolist");
var router                = express.Router();
var middleware            = require("../middleware");

// ===================================================================================================
//              Add to the List - Contains the adding to the list in the javascript helper function
// ===================================================================================================
router.get("/:listId/:movieId", middleware.isLoggedIn , middleware.checkListOwnershipviaName , function(req, res){
        addToMovieList(req.params.listId, req.params.movieId, req.user._id, req.user.username);
        var referrer = String(req.get('Referrer'));
        var tokens = referrer.split('/').slice(3);
        var redirectURL = tokens.join('/');
        res.redirect("/" + redirectURL);
});


module.exports = router;