const express = require('express');
const app = express();
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const cors = require('cors');

// Load environment variables from a .env file located next to this file.
// This makes loading deterministic even when nodemon / npm run is started
// from the project root directory.
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Middlewear
app.use(express.json());
app.use(cors(
    { origin: true, credentials: true }
));   
// serve uploaded files (avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to Hospital Management System Server');
});

app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/billing', require('./routes/billing'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

// Start server
const startServer = async () => {
    try {
        await connectDB();
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();

module.exports = app;