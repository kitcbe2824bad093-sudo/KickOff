const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kickoff_db');
    console.log(`[KickOff DB] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[KickOff DB] Connection Error: ${error.message}`);
    console.warn(`[KickOff DB] If you don't have MongoDB running locally, start mongod or provide a MongoDB Atlas URI in backend/.env`);
    // Do not crash server in development if DB is temporarily offline, to allow API health checks
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
