if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const ejsMate = require("ejs-mate");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const listingRouter = require("./routes/listings");
const userRouter = require("./routes/user");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");

const dbUrl = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
mongoose.connect(dbUrl)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("MongoDB connection error:", err);
    });
    
    
// Tell Express where to find EJS views
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware to support PUT and DELETE from HTML forms
app.use(methodOverride("_method"));

// Serve static files (CSS, JS) from /public
app.use(express.static(path.join(__dirname, "public")));

// Session configuration
const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 3600,
  }),
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });
    if (user) return done(null, user);

    const email = profile.emails[0].value;
    user = await User.findOne({ email });
    if (user) {
      user.googleId = profile.id;
      await user.save();
      return done(null, user);
    }

    const newUser = new User({
      googleId: profile.id,
      email,
      username: profile.displayName,
    });
    await newUser.save();
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.use("/listings", listingRouter);
app.use("/", userRouter);

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error", { message });
});


// Start the server
app.listen(3000, () => {
console.log("Server started on port 3000");
});