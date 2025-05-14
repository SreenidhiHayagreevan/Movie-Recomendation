require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  // Try to use MongoDB Atlas connection string from .env, 
  // or use local MongoDB if Atlas is not configured
  mongoURI: process.env.MONGODB_URI || 'mongodb+srv://pranavreddygaddam:Vanarp%4002082001@movie-mate-cluster.w76e422.mongodb.net/userdb?retryWrites=true&w=majority&appName=Movie-Mate-Cluster',
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
  jwtExpire: process.env.JWT_EXPIRE || '30d',
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendURL: process.env.FRONTEND_URL || 'http://localhost:5173'
}; 