const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const routes = require('../routes');

const app = express();
dotenv.config();

// ✅ Set Mongoose-specific options globally
mongoose.set('bufferCommands', false);
mongoose.set('bufferMaxEntries', 0);

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://clean-bubble.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

let isConnected = false;

const connectToDatabase = async () => {
    if (isConnected) {
        return;
    }

    try {
        // ✅ Only pass MongoDB driver options here
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10,              // MongoDB driver option
            serverSelectionTimeoutMS: 5000, // MongoDB driver option  
            socketTimeoutMS: 45000,       // MongoDB driver option
            family: 4                     // MongoDB driver option
        });

        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is working on Vercel!' });
});

app.use('/api', routes);


module.exports = app;
