const mongoose = require('mongoose');
require('dotenv').config();

// Ensure DB_URL is set
const mongoURI = 'mongodb://localhost:27017/foodpage';
if (!mongoURI) {
    console.error("Error: DB_URL is not defined in environment variables.");
    process.exit(1);
}

// Connect to MongoDB (Remove deprecated options)
mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    });

const db = mongoose.connection;

// Event Listeners
db.on('error', (err) => {
    console.error('Mongoose connection error:', err);
});

module.exports = db;
