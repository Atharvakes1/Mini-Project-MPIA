import mongoose from 'mongoose';

let isDemoMode = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || '';

  // Detect placeholder / missing URI → switch to demo mode
  if (!uri || uri.includes('<user>') || uri.includes('<password>') || uri === '') {
    console.log('⚠️  No valid MONGO_URI found — running in DEMO MODE (in-memory data)');
    console.log('   To use a real database, set MONGO_URI in server/.env');
    isDemoMode = true;
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('⚠️  Falling back to DEMO MODE (in-memory data)');
    isDemoMode = true;
  }
};

export const getDemoMode = () => isDemoMode;
export default connectDB;
