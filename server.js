const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your OpenWeather API key
const OPENWEATHER_API_KEY = '3e0922230ef35373fed5bac85c580b25';

app.use(express.static(__dirname));

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPENWEATHER_API_KEY}&units=metric`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const data = await response.json();

    // Map OpenWeather data to your frontend format
    const result = {
      city: data.name,
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      feels_like: data.main.feels_like,
      wind_speed: data.wind.speed
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
