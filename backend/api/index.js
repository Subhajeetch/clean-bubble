const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Import your routes
const routes = require('../routes');

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'https://clean-bubble.vercel.app'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to MongoDB successfully")
    } catch (error) {
        console.log("Connect failed " + error.message)
    }
}
connectDB();


// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Backend API is working on Vercel!' });
});

app.use('/api', routes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});