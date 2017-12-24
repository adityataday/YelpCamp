var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//Index - Show all campgrounds
router.get("/", function(req,res){
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
router.get("/new", function(req, res) {
   res.render("campgrounds/new"); 
});

// Create - add new campground to database
router.post("", function(req, res){
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
router.get(":id", function(req, res) {
    //find the campground with provided ID and show about that
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
    
});

module.exports = router;
