var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
        {name: "Granite Hill", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
        {name: "Granite Hill", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
        {name: "Granite Hill", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"},
        {name: "Salmon creek", image:"https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg"},
        {name: "Granite Hill", image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm5.staticflickr.com/4016/4369518024_0f64300987.jpg"}
        ]; 

app.get("/", function(req, res){
   res.render("landing");
});

app.get("/campgrounds", function(req,res){
        res.render("campgrounds", {campgrounds: campgrounds});
});

app.get("/campgrounds/new", function(req, res) {
   res.render("new"); 
});

app.post("/campgrounds", function(req, res){
   //get data from from and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var newCampground ={
        name: name,
        image: image
    };
    
    campgrounds.push(newCampground);
    
   //redirect back to campgrounds;
   res.redirect("/campgrounds");
});

app.listen(process.env.PORT, process.env.IP,function(){
    console.log("The YelpCamp Server has Started!");
});