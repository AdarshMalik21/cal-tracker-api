import express from 'express'
import {
  getMeasurements,
  getLatestMeasurement,
  addMeasurement,
  updateMeasurement,
  deleteMeasurement,
} from '../controllers/measurement.controller.js'

const router = express.Router()

router.get('/latest', getLatestMeasurement)
router.get('/',       getMeasurements)
router.post('/',      addMeasurement)
router.put('/:id',    updateMeasurement)
router.delete('/:id', deleteMeasurement)

export default router