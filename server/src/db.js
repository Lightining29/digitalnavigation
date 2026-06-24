import mongoose from 'mongoose';
import config from './config.js';

let isConnected = false;

export async function connectDB(uri = config.mongoUri) {
  if (!uri) {
    throw new Error('MONGO_URI is not set. Check your .env file.');
  }

  mongoose.set('strictQuery', true);

  mongoose.connection.on('connected', () => {
    isConnected = true;
    console.log(`[mongo] connected to ${mongoose.connection.name}`);
  });
  mongoose.connection.on('error', (err) => {
    console.error('[mongo] connection error:', err.message);
  });
  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    console.warn('[mongo] disconnected');
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    dbName: 'digitalinnovation',
  });

  return mongoose.connection;
}

export async function closeDB() {
  if (isConnected) await mongoose.disconnect();
}

export default connectDB;
