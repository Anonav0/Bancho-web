var express = require("express");
var router = express.Router();
var User = require("../models/user");
require("dotenv").config();

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

//User edit template
router.get("/user/:id/edit", function(req, res){
    User.findById(req.params.id, function(err, foundUser) {
        if (err || !foundUser) {
            req.flash("error", "Something went wrong.");
            console.log(err);
            res.redirect("back");
        } else {
            res.render("user/edit", {user: foundUser});
        }
    });
});

//User update 
router.put("/user/:id",upload.single('avatar'), function(req, res){
 
    User.findById(req.params.id, async function(err, foundUser){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
              try {
                  await cloudinary.v2.uploader.destroy(foundUser.avatarId);
                  var result = await cloudinary.v2.uploader.upload(req.file.path);
                  foundUser.avatar = result.secure_url;
                  foundUser.avatarId = result.public_id;
              } catch(err) {
                  req.flash("error", err.message);
                  return res.redirect("back");
              }
            }
            foundUser.about = req.body.about;
            foundUser.firstName = req.body.firstName;
            foundUser.lastName = req.body.lastName;
            foundUser.email = req.body.email;
            foundUser.save();
            req.flash("success","Successfully Updated!");
            res.redirect("/home");
        }
    });

});



module.exports = router;