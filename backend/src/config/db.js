const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully (Atlas)');
  } catch (error) {
    console.warn('MongoDB Atlas connection failed:', error.message);
    console.log('Falling back to local in-memory MongoDB database...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('MongoDB connected successfully (In-Memory Fallback)');
    } catch (fallbackErr) {
      console.error('Database connection completely failed:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
