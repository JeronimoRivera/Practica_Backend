const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  createProperty,
  listProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProperty);
router.get('/', listProperties);
router.get('/:id', getPropertyById);
router.put('/:id', updateProperty);
router.delete('/:id', deleteProperty);

module.exports = router;
