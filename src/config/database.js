const mongoose = require('mongoose');
const logger = require('../utils/logger');

const getMongoUri = () => {
  const env = process.env.NODE_ENV || 'development';
  
  // Log available environment variables for debugging
  logger.info('Available environment variables:', Object.keys(process.env).join(', '));
  logger.info('Current environment:', env);
  
  // Use environment-specific URIs
  switch (env) {
    case 'production':
      if (!process.env.MONGO_URI_PROD) {
        logger.error('Production MongoDB URI is not defined. Please set MONGO_URI_PROD environment variable.');
        throw new Error('Production MongoDB URI is not defined');
      }
      logger.info('Using production MongoDB URI');
      return process.env.MONGO_URI_PROD;
    case 'test':
    case 'development':
    default:
      if (!process.env.MONGO_URI_DEV) {
        logger.error('Development MongoDB URI is not defined. Please set MONGO_URI_DEV environment variable.');
        throw new Error('Development MongoDB URI is not defined');
      }
      logger.info('Using development MongoDB URI');
      return process.env.MONGO_URI_DEV;
  }
};

const connectDB = async () => {
  try {
    const mongoUri = getMongoUri();
    const env = process.env.NODE_ENV || 'development';
    
    logger.info(`Connecting to MongoDB (${env} environment)...`);
    logger.info('MongoDB URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//****:****@')); // Log URI without credentials
    
    const conn = await mongoose.connect(mongoUri);

    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = { connectDB }; 