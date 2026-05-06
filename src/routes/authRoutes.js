const express = require('express');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Ejemplo de ruta protegida futura:
// router.get('/profile', authMiddleware, (req, res) => {
//   res.json({ user: req.user });
// });

module.exports = router;
