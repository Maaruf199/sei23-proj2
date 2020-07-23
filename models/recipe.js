const mongoose = require('mongoose')

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  ingredients: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  directions: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  foodImage: {
    type: Buffer,
    required: true
  },
  foodImageType: {
    type: String,
    required: true
  },
  chef: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Chef'
  }
})

recipeSchema.virtual('foodImagePath').get(function() {
  if (this.foodImage != null && this.foodImageType != null) {
    return `data:${this.foodImageType};charset=utf-8;base64,${this.foodImage.toString('base64')}`
  }
})

module.exports = mongoose.model('Recipe', recipeSchema)