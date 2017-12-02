var express    =  require("express"),
    app        =  express(),
    bodyParser =  require("body-parser"),
    mongoose   =  require("mongoose"),
    passport   =  require("passport"),
    LocalStrategy = require("passport-local"),
    Campground =  require("./models/campground"),
    seedDB     =  require("./seeds"),
    User       =  require("./models/user"),
    Comment    =  require("./models/comment");
    
// Requiring routes

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index");
    

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp", { useMongoClient: true });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

//Seeding the database    
seedDB();

// Passport Config

app.use(require("express-session")({
    secret: "The quick brown fox jumps over the lazy dog",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});

app.use("/",indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The YelpCamp Server has Started!");
});