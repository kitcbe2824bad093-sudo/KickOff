const express = require('express');
const router = express.Router();
const {
  getCourts,
  getCourtById,
  getCourtAvailability,
  createCourt,
  updateCourt,
  deleteCourt
} = require('../controllers/courtController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .get(getCourts)
  .post(protect, authorize('admin'), createCourt);

router.route('/:id')
  .get(getCourtById)
  .put(protect, authorize('admin'), updateCourt)
  .delete(protect, authorize('admin'), deleteCourt);

router.get('/:id/availability', getCourtAvailability);

module.exports = router;
