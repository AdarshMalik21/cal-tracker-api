import express from 'express'
import {
  getProfile,
  updateProfile,
  recalculateTargets,
} from '../controllers/profile.controller.js'

const router = express.Router()

router.get('/',            getProfile)
router.put('/',            updateProfile)
router.post('/recalculate', recalculateTargets)

export default router