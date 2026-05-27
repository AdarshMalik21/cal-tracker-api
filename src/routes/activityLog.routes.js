import express from 'express'
import {
  getActivityLog,
  addActivityLog,
  updateActivityLog,
  deleteActivityLog,
  getActivityLogRange,
} from '../controllers/activityLog.controller.js'

const router = express.Router()

// specific routes before /:id
router.get('/range',  getActivityLogRange)

router.get('/',       getActivityLog)
router.post('/',      addActivityLog)
router.put('/:id',    updateActivityLog)
router.delete('/:id', deleteActivityLog)

export default router