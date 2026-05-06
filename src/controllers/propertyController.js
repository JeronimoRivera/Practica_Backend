const propertyService = require('../services/propertyService');
const {
  propertyCreateSchema,
  propertyUpdateSchema,
  propertyQuerySchema,
} = require('../schemas/propertySchemas');

const createProperty = async (req, res, next) => {
  try {
    const parsedData = propertyCreateSchema.parse(req.body);
    const property = await propertyService.createProperty(parsedData, req.user.id);
    return res.status(201).json({ message: 'Propiedad creada correctamente', property });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

const listProperties = async (req, res, next) => {
  try {
    const parsedQuery = propertyQuerySchema.parse(req.query);
    const result = await propertyService.getProperties(parsedQuery);
    return res.json(result);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

const getPropertyById = async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(Number(req.params.id));
    return res.json({ property });
  } catch (error) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
};

const updateProperty = async (req, res, next) => {
  try {
    const parsedData = propertyUpdateSchema.parse(req.body);
    const property = await propertyService.updateProperty(
      Number(req.params.id),
      parsedData,
      req.user.id
    );
    return res.json({ message: 'Propiedad actualizada correctamente', property });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    console.error(error);
    next(error);
  }
};

const deleteProperty = async (req, res, next) => {
  try {
    await propertyService.deleteProperty(Number(req.params.id), req.user.id);
    return res.json({ message: 'Propiedad eliminada correctamente' });
  } catch (error) {
    console.error(error);
    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }
    next(error);
  }
};

module.exports = {
  createProperty,
  listProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
