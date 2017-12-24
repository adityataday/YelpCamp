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


app.get("/", function(req, res){
   res.render("landing");
});

//Index - Show all campgrounds
app.get("/campgrounds", function(req,res){
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else{
           res.render("campgrounds/index", {campgrounds: allCampgrounds});
       }
    });
});

//New - form for new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// Create - add new campground to database
app.post("/campgrounds", function(req, res){
   //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground ={
        name: name, 
        image: image,
        description: description
    };
    
    //Create a new campground and save on the DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campgrounds;
            res.redirect("/campgrounds");
        }
    });
    
});

// Show - shows detials about the campground
app.get("/campgrounds/:id", function(req, res) {
    //find the campground with provided ID and show about that
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
    
});

//================
// COMMENTS ROUTE
//================

app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res) {
    
   Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
          console.log(err);
      } else{
          res.render("comments/new", {campground: foundCampground}); 
      }
   });
   
});

app.post("/campgrounds/:id/comments", isLoggedIn ,function(req,res){
    
    Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
          console.log(err);
      } else{
          Comment.create(req.body.comment, function(err, comment){
              if(err){
                  console.log(err);
              }else{
                  foundCampground.comments.push(comment);
                  foundCampground.save();
                  res.redirect("/campgrounds/" + foundCampground._id);
              }
          });
      }
   });
});

//===============
// AUTH ROUTES
//===============

//show register form

app.get("/register", function(req, res) {
    res.render("register");
});

//handle sign up logic

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});

//show login form

app.get("/login", function(req, res) {
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect: "/login"
}), function(req, res) {
    
});

// logout route

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The YelpCamp Server has Started!");
});