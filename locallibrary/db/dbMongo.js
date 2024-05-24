const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_PATH, {dbName: 'local_library'});
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectMongoDB;
