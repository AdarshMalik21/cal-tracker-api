import express from 'express'
import {
  getWeeklyReview,
  getLatestWeeklyReview,
  createWeeklyReview,
  getWeeklyReviewHistory,
} from '../controllers/weeklyReview.controller.js'

const router = express.Router()

router.get('/latest',  getLatestWeeklyReview)
router.get('/history', getWeeklyReviewHistory)
router.get('/',        getWeeklyReview)
router.post('/',       createWeeklyReview)

export default router