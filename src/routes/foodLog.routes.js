import express from 'express'
import {
  getFoodLog,
  addFoodLog,
  updateFoodLog,
  deleteFoodLog,
  getDailySummary,
  getFoodLogRange,
} from '../controllers/foodLog.controller.js'

const router = express.Router()

// specific routes before /:id
router.get('/summary', getDailySummary)
router.get('/range',   getFoodLogRange)

router.get('/',       getFoodLog)
router.post('/',      addFoodLog)
router.put('/:id',    updateFoodLog)
router.delete('/:id', deleteFoodLog)

export default router