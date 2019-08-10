var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: {type: String, unique: true, required: true},
    password: String,
    firstName: String,
    lastName: String, 
    avatar: String,
    avatarId: String,
    email : {type: String, unique: true, required:true},
    about: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);