var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//SCHEMA SETUP

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


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
           res.render("index", {campgrounds: allCampgrounds})
       }
    });
});

//New - form for new campground
app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
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
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("show", {campground: foundCampground});
        }
    });
    
    
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The YelpCamp Server has Started!");
});