var express = require("express");
var router = express.Router();
var Contents = require("../models/content");
var Users = require("../models/user");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Contents.find({}, function(err, foundContents){
        if(err) {
            console.log(err);
        } else {
            if(!req.user){
                return res.render("contents/index", { contents: foundContents});
            }
            //find user
            Users.findById(req.user._id, function(err, foundUser) {
                if(err){
                    console.log(err) 
                } else {
                    Contents.find().where("author.id").equals(foundUser._id).exec(function(err, userContents){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("contents/index", {contents: foundContents, user: foundUser, userContents: userContents, page: 'home'})
                        }
                    });
                }
            });
           
            
        }
    });
});

//new route
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("contents/new");
});

//create route
router.post("/",middleware.isLoggedIn,  function(req,res){
    //add author to the content
    req.body.content.author = {
        id: req.user._id,
        username: req.user.username
    }
    Contents.create(req.body.content, function(err, createdContent) {
        if(err){
            req.flash('error', err.message);
            console.log(err);
        } else {
            res.redirect("/home");
            console.log(createdContent);
        }
    });
});
 
//show route
router.get("/:id", function(req, res){
    Contents.findById(req.params.id).populate("comments").exec(function(err, foundContent) {
        if(err) {
            console.log(err);
        } else {
            // searching user
            Users.findById(foundContent.author.id, function(err, foundUser) {
                if(err) {
                    console.log(err);
                } else {
                    Contents.find().where("author.id").equals(foundUser._id).exec(function(err, userContents) {
                        if(err){
                            console.log(err);
                        } else {
                            res.render("contents/show", {content: foundContent, user: foundUser, userContents: userContents});
                        }
                    });

                }
            });
            
        }
    });
});

//edit route
router.get("/:id/edit", middleware.checkContentOwnership, function(req, res) {
    Contents.findById(req.params.id, function(err, foundContent){
        if(err) {
            console.log(err);
        } else {
            res.render("contents/edit", {content: foundContent});
        }
    });
});

//update route
router.put("/:id",middleware.checkContentOwnership, function(req, res){
    Contents.findByIdAndUpdate(req.params.id, req.body.content, function(err, updatedContent) {
        if(err) {
            console.log(err);
        } else {
            res.redirect("/home/" + req.params.id);
            console.log(updatedContent);
        }
    });
});

//delete route
router.delete("/:id",middleware.checkContentOwnership, function(req, res){
    Contents.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("/home");
        }
    });
});

module.exports = router;