const prisma = require('../config/db');

const createProperty = async (data, userId) => {
  return await prisma.property.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      price: data.price,
      ownerId: userId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      price: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

const getProperties = async ({ location, minPrice, maxPrice, page, limit }) => {
  const where = {};

  if (location) {
    where.location = {
      contains: location,
      mode: 'insensitive',
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  const skip = (page - 1) * limit;
  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.property.count({ where }),
  ]);

  return {
    properties,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPropertyById = async (id) => {
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!property) {
    const error = new Error('Propiedad no encontrada');
    error.status = 404;
    throw error;
  }

  return property;
};

const updateProperty = async (id, data, userId) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.ownerId !== userId) {
    const error = new Error('Propiedad no encontrada');
    error.status = 404;
    throw error;
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data,
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      price: true,
      ownerId: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedProperty;
};

const deleteProperty = async (id, userId) => {
  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.ownerId !== userId) {
    const error = new Error('Propiedad no encontrada');
    error.status = 404;
    throw error;
  }

  await prisma.property.delete({ where: { id } });
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
