var express = require("express");
var methodOverride = require("method-override");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var bodyParser = require("body-parser");
var flash = require("connect-flash");
var User = require("./models/user");
var app = express();

//REQUIRING ROUTES
var contentRoute = require("./routes/content");
var commentRoute = require("./routes/comment");
var indexRoute = require("./routes/index");
var userRoute = require("./routes/user");

app.use(flash());

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "lots of abuses here",
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//database config
var url =  "mongodb+srv://tom:qut1vjqO5SMdJQs2@cluster0-luqes.mongodb.net/test?retryWrites=true&w=majority";
// var url =  "mongodb://localhost/newCo"
mongoose.connect(url, {useNewUrlParser: true});



app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

//for the time format
app.locals.moment = require("moment");


app.get("/", function(req, res){
    res.render("landing");
});

//to get the user info in all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


app.use("/home", contentRoute);
app.use(commentRoute);
app.use(indexRoute);
app.use(userRoute);



app.listen(  3000 || process.env.PORT ,  process.env.IP, function(err){
    console.log("server started");
});


