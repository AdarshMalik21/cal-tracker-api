import express from 'express'
import {
  getWeightLogs,
  addWeightLog,
  updateWeightLog,
  deleteWeightLog,
  getWeightStats,
} from '../controllers/weight.controller.js'

const router = express.Router()

router.get('/stats', getWeightStats)
router.get('/',      getWeightLogs)
router.post('/',     addWeightLog)
router.put('/:id',   updateWeightLog)
router.delete('/:id',deleteWeightLog)

export default router