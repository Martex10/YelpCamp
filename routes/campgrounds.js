const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// index route-route to campground page show all campgrounds
router.get("/", function(req, res){
    //get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("error");
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE route add new campground to data base
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to camp grounds array 
    const name = req.body.name,
     price = req.body.price,
     image = req.body.image,
     desc = req.body.description,
     author ={
        id: req.user._id,
        username: req.user.username
    };
    //created an object to push on to the Array
    let newCampground = {name: name, image: image, description: desc, author: author, price: price};
    // create a new camp ground and save to data base
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log("ERROR");
            console.log(err );
        } else {
        // redirect to campgrounds page see changes. as a get request   
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW route shows form so that user can add new camp ground info
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW route will show more data on one campground
router.get("/:id", function(req, res){
    // finnd the campground with provided
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("ERROR");
            console.log(err);
        } else {
            //render show template with found camp data
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit campground routes
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    //is userlogged in 
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});
        
    

//update campground routes
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Destry campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
        
    });
});

module.exports = router;