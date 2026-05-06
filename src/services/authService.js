const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const SALT_ROUNDS = 10;

const registerUser = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error('El email ya está en uso');
    error.status = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  return user;
};

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    const error = new Error('Credenciales inválidas');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    }
  );

  return token;
};

module.exports = {
  registerUser,
  loginUser,
};
