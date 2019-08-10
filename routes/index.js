var express = require("express");
    router = express.Router();
    passport = require("passport");
    User = require("../models/user");
    require("dotenv").config();
    async = require("async");


//for image in the avatar
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'tom980h', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//register page
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

//handle sign up logic
router.post("/register", upload.single("avatar"), function(req, res){

    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if (err){
            return res.redirect("back");
        }
        // add cloudinary url for the image to the user object under avatar property
        req.body.avatar = result.secure_url;
        // add image's public_id to user object
        req.body.avatarId = result.public_id;

        var newUser = new User({
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            avatar: req.body.avatar,
            avatarId: req.body.avatarId,
            email: req.body.email
        });

        User.register(newUser, req.body.password, function(err, usr){
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                passport.authenticate("local")(req, res, function(){
                    res.redirect("/home");
                    console.log(newUser);
                });
            }
        });
    });
});

//login page
router.get("/login", function(req, res) {
    res.render("login", {page: 'login'});
});

//handle login logic
router.post("/login",passport.authenticate("local", {
    successRedirect: "/home", 
    failureRedirect: "/login"
    }),  function(req, res){

});

//handle logout route
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("back");
}); 


module.exports = router;