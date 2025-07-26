const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');


// momgodb
const mongoose = require('mongoose');

// routes
const routes = require('./routes');

const app = express();
const port = 9000;
dotenv.config();
app.use(cookieParser());
app.use(express.json());

// only specific origins
const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend-domain.com'
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));



// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI).then((conn) => {
    console.log('Connected to MongoDB. Collection Name:', conn.connection.name);
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