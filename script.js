// Weather card and loader elements
const weatherCard = document.getElementById('weatherCard');
const loader = document.getElementById('loader');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
  // Hide weather card initially
  weatherCard.style.opacity = '0';
  
  // Allow enter key to trigger search
  document.getElementById('locationInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      getWeather();
    }
  });
});

async function getWeather() {
  const location = document.getElementById('locationInput').value;
  if (!location) return showError('Please enter a location');

  // Show loading spinner
  loader.style.display = 'block';
  weatherCard.style.opacity = '0';

  // Call your Node.js backend
  const encodedCity = encodeURIComponent(location);
  const apiUrl = `/api/weather?city=${encodedCity}`;

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error('Location not found');
    }

    const data = await response.json();

    // Extract weather data
    const area = data.city || location;
    const desc = data.description || '';
    const temp = data.temperature || '';
    const humidity = data.humidity || '';
    const feelsLike = data.feels_like || '';
    const windSpeed = data.wind_speed || '';

    // Update the UI
    document.getElementById('city').innerText = area;
    document.getElementById('description').innerText = desc;
    document.getElementById('temperature').innerText = temp ? `${temp}°C` : '';
    document.getElementById('humidity').innerText = humidity ? `${humidity}%` : '';
    document.getElementById('feelsLike').innerText = feelsLike ? `${feelsLike}°C` : '';
    document.getElementById('wind').innerText = windSpeed ? `${windSpeed} m/s` : '';

    // Show weather card with animation
    setTimeout(() => {
      loader.style.display = 'none';
      weatherCard.style.opacity = '1';
    }, 500);

    // Apply weather animation and theme
    applyWeatherEffects(desc.toLowerCase());

  } catch (error) {
    showError('Failed to fetch weather. Please try again.');
    console.error(error);
    loader.style.display = 'none';
  }
}

function applyWeatherEffects(desc) {
  const container = document.getElementById('weatherAnimation');
  const body = document.body;
  
  // Clear previous animations
  container.innerHTML = '';
  
  // Reset body classes
  body.classList.remove('theme-sunny', 'theme-rainy', 'theme-cloudy', 'theme-snowy');
  
  if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
    // Rain animation
    body.classList.add('theme-rainy');
    createRaindrops(container, 100);
    
  } else if (desc.includes('snow') || desc.includes('sleet') || desc.includes('ice')) {
    // Snow animation
    body.classList.add('theme-snowy');
    createSnowflakes(container, 80);
    
  } else if (desc.includes('cloud') || desc.includes('overcast') || desc.includes('fog') || desc.includes('mist')) {
    // Cloudy animation
    body.classList.add('theme-cloudy');
    createClouds(container, 8);
    
  } else {
    // Sunny or clear animation (default)
    body.classList.add('theme-sunny');
    createSun(container);
  }
}

function createRaindrops(container, count) {
  for (let i = 0; i < count; i++) {
    const drop = document.createElement('div');
    drop.className = 'rain-drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.5 + Math.random() * 0.7}s`;
    drop.style.opacity = `${0.3 + Math.random() * 0.5}`;
    drop.style.height = `${10 + Math.random() * 15}px`;
    container.appendChild(drop);
  }
}

function createSnowflakes(container, count) {
  for (let i = 0; i < count; i++) {
    const flake = document.createElement('div');
    flake.className = 'snow-flake';
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.animationDuration = `${4 + Math.random() * 6}s`;
    flake.style.width = `${3 + Math.random() * 7}px`;
    flake.style.height = flake.style.width;
    flake.style.opacity = `${0.7 + Math.random() * 0.3}`;
    container.appendChild(flake);
  }
}

function createSun(container) {
  const sunContainer = document.createElement('div');
  sunContainer.className = 'sun-container';
  
  const sun = document.createElement('div');
  sun.className = 'sun';
  
  // Create sun rays
  for (let i = 0; i < 8; i++) {
    const ray = document.createElement('div');
    ray.className = 'sun-ray';
    ray.style.transform = `rotate(${i * 45}deg)`;
    sun.appendChild(ray);
  }
  
  sunContainer.appendChild(sun);
  container.appendChild(sunContainer);
}

function createClouds(container, count) {
  for (let i = 0; i < count; i++) {
    const cloud = document.createElement('div');
    cloud.className = 'cloud';
    
    // Create cloud shape (using multiple overlapping circles)
    const size = 40 + Math.random() * 60;
    cloud.style.width = `${size}px`;
    cloud.style.height = `${size * 0.6}px`;
    cloud.style.top = `${10 + Math.random() * 40}%`;
    cloud.style.opacity = `${0.6 + Math.random() * 0.3}`;
    cloud.style.animationDuration = `${60 + Math.random() * 80}s`;
    
    // Create shadow effect
    cloud.style.boxShadow = `
      ${size * 0.2}px ${size * 0.1}px ${size * 0.3}px rgba(255, 255, 255, 0.8),
      ${size * 0.4}px 0 ${size * 0.3}px rgba(255, 255, 255, 0.6),
      0 ${size * 0.1}px ${size * 0.3}px rgba(255, 255, 255, 0.6),
      ${size * -0.2}px 0 ${size * 0.3}px rgba(255, 255, 255, 0.6)
    `;
    
    container.appendChild(cloud);
  }
}

function downloadReport() {
  const city = document.getElementById('city').innerText;
  const description = document.getElementById('description').innerText;
  const temperature = document.getElementById('temperature').innerText;
  const humidity = document.getElementById('humidity').innerText;
  const feelsLike = document.getElementById('feelsLike').innerText;
  const wind = document.getElementById('wind').innerText;
  
  const date = new Date().toLocaleString();
  
  const content = 
`Weather Report
Generated on: ${date}
----------------------------
Location: ${city}
Weather: ${description}
Temperature: ${temperature}
Feels Like: ${feelsLike}
Humidity: ${humidity}
Wind Speed: ${wind}
----------------------------
Powered by Weather App`;

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `weather_${city.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().slice(0,10)}.txt`;
  link.click();
}

function showError(message) {
  alert(message);
  loader.style.display = 'none';
}
