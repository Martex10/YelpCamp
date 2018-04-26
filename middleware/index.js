// call the middleware goes here
const Campground = require("../models/campground");
const Comment = require("../models/comment");

const middlewareObj = {};

//check camp ground ownership
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    //
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                req.flash("error", "Campground Not Found");
                res.redirect("/campgrounds");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You Dont Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
};

//middle ware check comment owner ship 
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Comment Not Found");
                res.redirect("/campgrounds");
            } else {
                //does user own comment
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error", "You Dont Have Permission To Do That");
                    res.redirect("back");
                }
            }
        });
    } else {
        //please sign in
        req.flash("error", "You Need To Be Logged In To Do That");
        res.redirect("back");
    }
};


//middle ware is the user logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You Need To Be Logged In To Do That");
    res.redirect("/login");
};

module.exports = middlewareObj;