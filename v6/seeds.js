var mongoose = require("mongoose");

var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    { 
        name: "Cloud's Rest",
        image: "https://farm1.staticflickr.com/112/316612921_f23683ca9d.jpg",
        description: "Doesnt this look like cresters keep?"
    },
     { 
        name: "Dessert Mesa",
        image: "https://farm3.staticflickr.com/2919/14554501150_8538af1b56.jpg",
        description: "Doesnt this look like cresters keep?"
    },
     { 
        name: "Canyon Floor",
        image: "https://farm2.staticflickr.com/1075/1132747626_f7adec63dd.jpg",
        description: "Doesnt this look like cresters keep?"
    }
];
function seedDB(){
    //Remove all campgrounds
        Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        
        //Add a few campgrounds
        data.forEach(function(seed){
            Campground.create(seed, function(err,campground){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("added a campground");
                    
                    //Create a comment
                    Comment.create(
                        {
                            text: "This place is great, but I wish there was internet",
                            author: "Homer"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                campground.comments.push(comment);
                                campground.save();
                            }
                        });
                }
            });
        });
    });
    
    
    
}

module.exports = seedDB;
