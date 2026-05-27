import express from 'express'
import {
  getSupplements,
  createSupplement,
  updateSupplement,
  deleteSupplement,
  getSupplementLog,
  logSupplement,
  updateSupplementLog,
} from '../controllers/supplement.controller.js'

const router = express.Router()

router.get('/log',      getSupplementLog)
router.post('/log',     logSupplement)
router.put('/log/:id',  updateSupplementLog)

router.get('/',         getSupplements)
router.post('/',        createSupplement)
router.put('/:id',      updateSupplement)
router.delete('/:id',   deleteSupplement)

export default router