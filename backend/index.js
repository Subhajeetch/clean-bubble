const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// momgodb
const mongoose = require('mongoose');

// routes
const routes = require('./routes');

const app = express();
const port = 9000;
dotenv.config();

// only specific origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend-domain.com'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});


app.get('/', (req, res) => {
    res.json({ message: 'gyatttt!' });
});


// all the routes
app.use('/api', routes);


app.listen(port, () => {
    console.log(`Server is up: http://localhost:${port}`);
});