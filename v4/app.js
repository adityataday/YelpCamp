var express    =  require("express"),
    app        =  express(),
    bodyParser =  require("body-parser"),
    mongoose   =  require("mongoose"),
    Campground =  require("./models/campground"),
    seedDB     =  require("./seeds"),
    Comment    =  require("./models/comment");
    

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//Seeding the database    
seedDB();



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
           res.render("campgrounds/index", {campgrounds: allCampgrounds})
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

app.get("/campgrounds/:id/comments/new", function(req, res) {
    
   Campground.findById(req.params.id,function(err, foundCampground){
      if(err){
          console.log(err);
      } else{
          res.render("comments/new", {campground: foundCampground}); 
      }
   });
   
});

app.post("/campgrounds/:id/comments",function(req,res){
    
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

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The YelpCamp Server has Started!");
});