const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


app.post('/sensor-data', (req, res) => {
    const { pH, temperature, dissolvedOxygen, salinity } = req.body;

    // Validate received data
    if (typeof pH !== 'number' || typeof temperature !== 'number' || typeof dissolvedOxygen !== 'number' || typeof salinity !== 'number') {
        return res.status(400).json({ error: 'Invalid sensor data format received' });
    }

  
    console.log('Received Sensor Data:');
    console.log('pH:', pH);
    console.log('Temperature:', temperature);
    console.log('Dissolved Oxygen:', dissolvedOxygen);
    console.log('Salinity:', salinity);


    res.json({ message: 'Sensor data received successfully' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
