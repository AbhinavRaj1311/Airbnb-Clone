import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: process.env.PORT || 5001,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/staygallery',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  useInMemory: false, // Will be set to true if MongoDB fails
  jwtSecret: process.env.JWT_SECRET || 'staygallery_dev_secret_change_in_production_2024',
}
