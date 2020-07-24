const express = require ('express')
const app = express()
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')
require("dotenv").config();
const methodOverride = require('method-override')
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash")
const isLoggedIn = require("./config/loginBlocker");

// mongodb connection code
mongoose.connect(
  process.env.MONGODBLIVE,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify:false,
  },
  () => {
    console.log("Mongodb connected!");
  }
);

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

app.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

const indexRouter = require('./routes/index')
const chefRouter = require('./routes/chefs')
const recipeRouter = require('./routes/recipes')
const authRouter = require('./routes/auth.route')

// app.get("/", (req, res) => {
//   res.redirect("/dashboard");
// });
  
app.use('/', indexRouter)
app.use('/chefs', chefRouter)
app.use('/recipes', recipeRouter)
app.use('/auth.route', authRouter)

// app.get("*", (req, res) => {
//   res.send("does not exist");
// });

app.use("/partials", require("./routes/auth.route"));
app.use("/auth", require("./routes/auth.route"));
app.use("/", isLoggedIn, require("./routes/user.route"));

app.listen(process.env.PORT || 3003); {
    console.log('express running on PORT 3003')
}



