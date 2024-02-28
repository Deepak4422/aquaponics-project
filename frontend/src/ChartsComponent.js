import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js';

ChartJS.register(
 LineElement, CategoryScale, LinearScale, PointElement
)



const ChartsComponent = () => {
  const [raw_temperature, setRaw_temperature] = useState([]);
  const [pressure, setPressure] = useState([]);
  const [humidity, setHumidity] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:7000/receiveData');
      
      // Update state with the latest data by concatenating with the existing state arrays
      setRaw_temperature(prevData => prevData.concat(response.data.raw_temperature));
      setPressure(prevData => prevData.concat(response.data.pressure));
      setHumidity(prevData => prevData.concat(response.data.humidity));
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  return (
    <div>
      <h1>Charts</h1>
      <LineChart data={raw_temperature} label="Temperature (Kelvin)" />
      <LineChart data={pressure} label="Pressure (kPascal)" />
      <LineChart data={humidity} label="Humidity (%)" />
    </div>
  );
};

const LineChart = ({ data, label }) => {
  const chartData = {
    labels: data.map((_, index) => index + 1), // Assuming data is an array of values
    datasets: [
      {
        label: label,
        data: data,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        }
      },
      y: {
        title: {
          display: true,
          text: label
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
};

export default ChartsComponent;
