import express from 'express'
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  getSavedMeals,
  createSavedMeal,
  updateSavedMeal,
  deleteSavedMeal,
} from '../controllers/food.controller.js'

const router = express.Router()

// saved meals — must come before /:id
router.get('/saved-meals',     getSavedMeals)
router.post('/saved-meals',    createSavedMeal)
router.put('/saved-meals/:id', updateSavedMeal)
router.delete('/saved-meals/:id', deleteSavedMeal)

// regular foods
router.get('/',     getFoods)
router.get('/:id',  getFoodById)
router.post('/',    createFood)
router.put('/:id',  updateFood)
router.delete('/:id', deleteFood)

export default router