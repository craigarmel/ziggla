const express = require('express');
const router = express.Router();
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertiesController');
const authMiddleware = require('../middleware/authMiddleware'); // adjust path as needed

router
  .route('/')
  .get(getProperties)
  .post(createProperty);

router
  .route('/:id')
  .get(getProperty)
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;