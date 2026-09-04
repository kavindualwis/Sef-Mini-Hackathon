const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getMyServices,
  deleteService,
} = require('../controllers/serviceController');

router.post('/', createService);
router.get('/', getAllServices);
router.get('/my-services', getMyServices);
router.delete('/:id', deleteService);

module.exports = router;
