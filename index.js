var express               = require("express");
var app                   = express();
var bodyParser            = require("body-parser");
var mongoose              = require("mongoose");
var passport              = require("passport");
var localStrategy         = require("passport-local");
var flash                 = require("connect-flash");
var methodOverride        = require("method-override");
var addToMovieList        = require("./views/js/addtolist");
var User                  = require("./models/user");
var moviesLists           = require("./models/moviesmasterlist");
var movieRecord           = require("./models/movie");
var addTolist             = ['/home/list/', '/home/:pageID/list/'];


//Routes
var homeRoute                 = require("./Routes/browse.js");
var indexRoute                = require("./Routes/index.js");
var addListRoute              = require("./Routes/addList.js");
var displayListRoute          = require("./Routes/displayList.js");
var searchRoute               = require("./Routes/search.js");
var movieRoute                = require("./Routes/movie.js");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(flash());
app.locals.moment = require("moment");
app.locals.addToMovieList = addToMovieList;
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));

mongoose.connect('mongodb://localhost/movieDb', { useNewUrlParser: true, 
useUnifiedTopology: true }).then(() => 
console.log("Connected to MongoDB successfully!"))
    .catch(err => console.log(err));


app.use(require("express-session")({
   secret: "With great power comes great responsibility! Trust me about it",
   resave: false,
   saveUninitialized: false
}));

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

app.use(session({
    secret: 'With great power comes great responsibility! Trust me about it',
    resave: false,
    saveUninitialized: false,    
    //store: new MongoStore({ mongooseConnection: mongoose.connection }),
    //cookie:{maxAge: 180 * 60 * 1000}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

//mongoose.connect(process.env.DATABASEURL);

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// =========================================
//                  ROUTES
// =========================================

app.use("/",indexRoute);
app.use('/home/',homeRoute);
app.use(addTolist,addListRoute);
app.use('/list/',displayListRoute);
app.use('/search/', searchRoute);
app.use('/movie/', movieRoute);

const port=4040;
app.listen(port, function(){
   console.log("Movie-App Application started!!!"); 
});






