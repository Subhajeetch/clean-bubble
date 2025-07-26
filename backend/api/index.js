const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const routes = require('../routes');

const app = express();
dotenv.config();

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
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,        // Disable mongoose buffering
            bufferMaxEntries: 0,          // Disable mongoose buffering  
            maxPoolSize: 10,              // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying for 5 seconds
            socketTimeoutMS: 45000,       // Close sockets after 45 seconds
            family: 4                     // Use IPv4
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
