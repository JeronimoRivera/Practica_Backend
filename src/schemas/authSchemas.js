const { z } = require('zod');

const passwordRule = z.string().min(8, 'La contraseña debe tener al menos 8 caracteres');

const registerSchema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Debe ser un email válido'),
  password: passwordRule,
});

const loginSchema = z.object({
  email: z.string().email('Debe ser un email válido'),
  password: passwordRule,
});

module.exports = {
  registerSchema,
  loginSchema,
};
