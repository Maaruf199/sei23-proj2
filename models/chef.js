const mongoose = require('mongoose')
const Recipe = require('./recipe')

const chefSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true
  }  
})

chefSchema.pre('remove', function(next) {
  Recipe.find({ chef: this.id }, (err, recipes) => {
    if (err) {
      next(err)
    } else if (recipes.length > 0) {
      next(new Error('This chef has recipes still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Chef', chefSchema)