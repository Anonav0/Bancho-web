var express = require("express"),
    router  = express.Router(),
    Content = require("../models/content"),
    Comment = require("../models/comment"),
    middleware = require("../middleware");



//new comment route
router.get("/home/:id/comments/new", middleware.isLoggedIn,  function(req, res){
    Content.findById(req.params.id, function(err, foundContent){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {content: foundContent});
        }
    });
});

//create comment route
router.post("/home/:id/comments", middleware.isLoggedIn, function(req, res){
    Content.findById(req.params.id, function(err, foundContent){
        console.log(req.body.comment.text);
        Comment.create(req.body.comment, function(err, createdComment){
            if(err){
                console.log(err);
            } else {
                createdComment.author.id = req.user._id;
                createdComment.author.username = req.user.username;
                createdComment.save();
                foundContent.comments.push(createdComment);
                foundContent.save();
                res.redirect("/home/" + req.params.id);
                console.log(createdComment);
            }
        });
    });
});

//delete route as no edit route is needed here.
router.delete("/home/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect("back");
        }
    })
});


module.exports = router;