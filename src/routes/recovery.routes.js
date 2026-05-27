import express from 'express'
import {
  getRecoveryByDate,
  getSleepLog,
  logSleep,
  updateSleepLog,
  getWaterLog,
  logWater,
  updateWaterLog,
  getSorenessLog,
  logSoreness,
  updateSorenessLog,
} from '../controllers/recovery.controller.js'

const router = express.Router()

router.get('/', getRecoveryByDate)

router.get('/sleep',     getSleepLog)
router.post('/sleep',    logSleep)
router.put('/sleep/:id', updateSleepLog)

router.get('/water',     getWaterLog)
router.post('/water',    logWater)
router.put('/water/:id', updateWaterLog)

router.get('/soreness',     getSorenessLog)
router.post('/soreness',    logSoreness)
router.put('/soreness/:id', updateSorenessLog)

export default router