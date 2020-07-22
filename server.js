const express = require ('express')
const app = express()
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require('body-parser')
require("dotenv").config();
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const chefRouter = require('./routes/chefs')
const recipeRouter = require('./routes/recipes')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false}))

// mongodb connection code
mongoose.connect(
    process.env.MONGODBLIVE,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Mongodb connected!");
    }
  );
app.use('/', indexRouter)
app.use('/chefs', chefRouter)
app.use('/recipes', recipeRouter)


app.listen(process.env.PORT || 3003); {
    console.log('express running on PORT 3003')
}



