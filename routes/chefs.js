const express = require('express')
const router = express.Router()
const Chef = require('../models/chef')
const Recipe = require('../models/recipe')

// All Chefs Route
router.get('/', async (req, res) => {
    let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const chefs = await Chef.find(searchOptions)
    res.render('chefs/index', {
      chefs: chefs,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Chef Route
router.get('/new', (req, res) => {
    res.render('chefs/new', { chef: new Chef() })
})

// Create Chef Route
router.post('/', async (req, res) => {
  const chef = new Chef({
    name: req.body.name  
  })  
  try {
    const newChef = await chef.save()
    // res.redirect(`chefs/${newChef.id}`)
    res.redirect(`chefs`)
  } catch {
    res.render('chefs/new', {
      chef: chef,
      errorMessage: 'Error creating Chef'
        })       
  }
})
router.get('/:id', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id)
    const recipes = await Recipe.find({ chef: chef.id }).limit(6).exec()
    res.render('chefs/show', {
      chef: chef,
      recipesByChef: recipes
    })
  } catch {
    res.redirect('/')
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const chef = await Chef.findById(req.params.id)
    res.render('chefs/edit', { chef: chef })
  } catch {
    res.redirect('/chefs')
  }
})

router.put('/:id', async (req, res) => {
  let chef
  try {
    chef = await Chef.findById(req.params.id)
    chef.name = req.body.name
    await chef.save()
    res.redirect(`/chefs/${chef.id}`)
  } catch {
    if (chef == null) {
      res.redirect('/')
    } else {
      res.render('chefs/edit', {
        chef: chef,
        errorMessage: 'Error updating Chef'
      })
    }
  }
})

router.delete('/:id', async (req, res) => {
  let chef
  try {
    chef = await Chef.findById(req.params.id)
    await chef.remove()
    res.redirect('/chefs')
  } catch {
    if (chef == null) {
      res.redirect('/')
    } else {
      res.redirect(`/chefs/${chef.id}`)
    }
  }
})

module.exports = router