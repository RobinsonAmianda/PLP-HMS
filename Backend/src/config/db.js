const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');


// .env lives in the Backend root directory (../.. from src/config)
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB connected 📶📶');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); 
    }
}
module.exports = connectDB;