var express               = require("express");
var passport              = require("passport");
var User                  = require("../models/user");
var router                = express.Router();



router.get("/", function(req,res, next){
  res.redirect("/home/1");
});

router.get("/home", function(req,res, next){
  res.redirect("/home/1");
});


// ===============================
//          Login - Route 
// ===============================
router.get("/login", function(req,res){
   res.render("login");   
});

router.post("/login", passport.authenticate("local",

{
   successRedirect: "/home/1",
   failureRedirect: "/login",
   failureFlash : true
}),function(req,res){
});


// ===============================
//         Signup - Routes 
// ===============================
router.get("/register", function(req,res){
   res.render("signup");
});

router.post("/register", function(req, res){
   // console.log("Here");
   var newuser = new User({username: req.body.username});
   User.register(newuser, req.body.password, function(err,user){
      if(err){
         req.flash("error", err.message);
         return res.redirect("/register");
      }
      else
      {
            passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to Movies-Watch It " + user.username);
            res.redirect("/home/1");
            });
      }
   });
});

// ===============================
//         Logout - Route 
// ===============================
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged out!");
   res.redirect("/home/1");
});


module.exports = router;
