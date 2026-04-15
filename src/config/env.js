import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://192.168.0.128:27017',
  mongoDbName: process.env.MONGODB_DB_NAME || 'ecommerce-aula',
};
