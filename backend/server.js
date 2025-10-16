const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Connect to database
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const errorHandler = require('./middleware/error');

// Mount routers
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/exercises', require('./routes/exercises'));
app.use('/api/v1/workoutplans', require('./routes/workoutPlans'));
app.use('/api/v1/workoutsessions', require('./routes/workoutSessions'));
app.use('/api/v1/stats', require('./routes/stats'));

// Helmet
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = { app, server };