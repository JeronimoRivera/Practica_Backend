const authService = require('../services/authService');
const { registerSchema, loginSchema } = require('../schemas/authSchemas');

const register = async (req, res, next) => {
  try {
    const parsedData = registerSchema.parse(req.body);
    const user = await authService.registerUser(parsedData);
    res.status(201).json({ message: 'Usuario registrado correctamente', user });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const parsedData = loginSchema.parse(req.body);
    const token = await authService.loginUser(parsedData);
    res.json({ accessToken: token });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    next(error);
  }
};

module.exports = {
  register,
  login,
};
