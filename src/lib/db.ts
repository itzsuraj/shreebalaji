import mongoose from 'mongoose';

let isConnected = 0;

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (isConnected) {
    return mongoose;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set');
  }

  const conn = await mongoose.connect(mongoUri, {
    bufferCommands: false,
    maxPoolSize: 5,
  });

  isConnected = conn.connection.readyState;
  return conn;
}


