const express    = require("express"),
app              = express(),
bodyParser       = require("body-parser"),
mongoose         = require("mongoose"),
Campground       = require("./models/campground"),
Comment          = require("./models/comment"),
seedDB           = require("./seeds"),
passport         = require("passport"),
LocalStrategy    = require("passport-local"),
User             = require("./models/user"),
methodOverride   = require("method-override"),
flash            = require("connect-flash");

//requireing routes
const commentRoutes  = require("./routes/comments"),
campgroundRoutes     = require("./routes/campgrounds"),
indexRoutes           = require("./routes/index");

console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://localhost/yelp_camp_v12");
//mongoose.connect("mongodb://marcus:Ngq14949@ds259109.mlab.com:59109/yelpcamp_martex10");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

// seedDB(); //seed the datbase

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Dragons are the best",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passing current user to every ejs template
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server has Started");
});