const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// PostgreSQL database connection configuration
const pool = new Pool({
  user: 'your_database_user',
  host: 'your_database_host',
  database: 'your_database_name',
  password: 'your_database_password',
  port: 5432, // Default PostgreSQL port
});

// Middleware for authentication
const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (apiKey === 'your-api-key') {
        next(); // Allow request to continue
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Endpoint to insert sensor data
app.post('/insert-sensor-data', authenticate, async (req, res) => {
    const { pH, temperature, dissolvedOxygen, salinity } = req.body;

    // Validate received data
    if (typeof pH !== 'number' || typeof temperature !== 'number' || typeof dissolvedOxygen !== 'number' || typeof salinity !== 'number') {
        return res.status(400).json({ error: 'Invalid sensor data format' });
    }

    try {
        // Insert data into the database
        const query = 'INSERT INTO sensor_data (ph, temperature, dissolved_oxygen, salinity) VALUES ($1, $2, $3, $4)';
        const values = [pH, temperature, dissolvedOxygen, salinity];
        await pool.query(query, values);

        // Respond with a success message
        res.json({ message: 'Sensor data inserted successfully' });
    } catch (error) {
        console.error('Error inserting sensor data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
