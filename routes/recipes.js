const express = require('express')
const router = express.Router()
const Recipe = require('../models/recipe')
const Chef = require('../models/chef')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Recipes Route
router.get('/', async (req, res) => {
  let query = Recipe.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const recipes = await query.exec()
    res.render('recipes/index', {
      recipes: recipes,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Recipe Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Recipe())
})

// Create Recipe Route
router.post('/', async (req, res) => {
  const recipe = new Recipe({
    name: req.body.name,
    chef: req.body.chef,
    publishDate: new Date(req.body.publishDate),
    ingredients: req.body.ingredients,
    directions: req.body.directions
  })
  saveFood(recipe, req.body.food)

  try {
    const newRecipe = await recipe.save()
    res.redirect(`recipes/${newRecipe.id}`)
  } catch {
    renderNewPage(res, recipe, true)
  }
})

// Show Recipe Route
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
                           .populate('chef')
                           .exec()
    res.render('recipes/show', { recipe: recipe })
  } catch {
    res.redirect('/')
  }
})

// Edit Recipe Route
router.get('/:id/edit', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
    renderEditPage(res, recipe)
  } catch {
    res.redirect('/')
  }
})

// Update Recipe Route
router.put('/:id', async (req, res) => {
  let recipe

  try {
    recipe = await Recipe.findById(req.params.id)
    recipe.name = req.body.name
    recipe.chef = req.body.chef
    recipe.publishDate = new Date(req.body.publishDate)
    recipe.ingredients = req.body.ingredients
    recipe.directions = req.body.directions
    if (req.body.food != null && req.body.food !== '') {
      saveCover(recipe, req.body.food)
    }
    await recipe.save()
    res.redirect(`/recipes/${recipe.id}`)
  } catch {
    if (recipe != null) {
      renderEditPage(res, recipe, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Recipe Page
router.delete('/:id', async (req, res) => {
  let recipe
  try {
    recipe = await Recipe.findById(req.params.id)
    await recipe.remove()
    res.redirect('/recipes')
  } catch {
    if (recipe != null) {
      res.render('recipes/show', {
        recipe: recipe,
        errorMessage: 'Could not remove recipe'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, recipe, hasError = false) {
  renderFormPage(res, recipe, 'new', hasError)
}

async function renderEditPage(res, recipe, hasError = false) {
  renderFormPage(res, recipe, 'edit', hasError)
}

async function renderFormPage(res, recipe, form, hasError = false) {
  try {
    const chefs = await Chef.find({})
    const params = {
      chefs: chefs,
      recipe: recipe
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Recipe'
      } else {
        params.errorMessage = 'Error Creating Recipe'
      }
    }
    res.render(`recipes/${form}`, params)
  } catch {
    res.redirect('/recipes')
  }
}

function saveFood(recipe, foodEncoded) {
  if (foodEncoded == null) return
  const food = JSON.parse(foodEncoded)
  if (food != null && imageMimeTypes.includes(food.type)) {
    recipe.foodImage = new Buffer.from(food.data, 'base64')
    recipe.foodImageType = food.type
  }
}

module.exports = router