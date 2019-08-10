var Contents = require("../models/content");
var Comments = require("../models/comment");
var User = require("../models/user");
var middlewareObj = {};


middlewareObj.checkContentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Contents.findById(req.params.id, function(err, content){
            if(err || !content){
                req.flash("error", "THERE SEEMS A PROBLEM!");
                res.redirect("back");
            } else {
                if (content.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "YOU DON'T HAVE PERMISSION TO DO THAT");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You Need To Be Logged In To Do That!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comments.findById(req.params.comment_id, function(err, comment){
            if(err || !comment){
                req.flash("error", "THERE SEEMS A PROBLEM!");
                res.redirect("back");
            } else {
                if( comment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "YOU DON'T HAVE PERMISSION TO DO THAT");
                    res.redirect("back");
                }
            }
        });
    }else {
        req.flash("error", "You Need To Be Logged In To Do That!");
        res.redirect("back");
    }
}


middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "YOU MUST LOGIN FIRST");
    res.redirect("back");
}


module.exports = middlewareObj;