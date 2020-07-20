const express = require ('express')
const app = express()
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts")
require("dotenv").config();

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', './layout')
app.use(expressLayouts)
app.use(express.static('public'))

// mongodb connection code
mongoose.connect(
    process.env.MONGODB,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      console.log("Mongodb connected!");
    }
  );

app.use('/', indexRouter)

app.listen(process.env.PORT || 3003); {
    console.log('express running on PORT 3003')
}



