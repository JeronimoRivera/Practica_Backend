const { z } = require('zod');

const propertyCreateSchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  location: z.string().min(2, 'La ubicación es obligatoria'),
  price: z.number().positive('El precio debe ser un número mayor que 0'),
});

const propertyUpdateSchema = z
  .object({
    title: z.string().min(3, 'El título debe tener al menos 3 caracteres').optional(),
    description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres').optional(),
    location: z.string().min(2, 'La ubicación es obligatoria').optional(),
    price: z.number().positive('El precio debe ser un número mayor que 0').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Al menos un campo debe actualizarse',
  });

const propertyQuerySchema = z.object({
  location: z.string().optional(),
  minPrice: z.coerce.number().nonnegative('minPrice debe ser un número válido').optional(),
  maxPrice: z.coerce.number().nonnegative('maxPrice debe ser un número válido').optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});

module.exports = {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyQuerySchema,
};
