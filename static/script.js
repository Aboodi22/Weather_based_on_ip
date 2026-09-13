// === Weather Code → Icon + Description ===
const weatherIcons = {
    0:  { icon: '☀️', desc: 'Clear Sky' },
    1:  { icon: '🌤️', desc: 'Mainly Clear' },
    2:  { icon: '⛅', desc: 'Partly Cloudy' },
    3:  { icon: '☁️', desc: 'Overcast' },
    45: { icon: '🌫️', desc: 'Foggy' },
    48: { icon: '🌫️', desc: 'Depositing Rime Fog' },
    51: { icon: '🌧️', desc: 'Light Drizzle' },
    53: { icon: '🌧️', desc: 'Moderate Drizzle' },
    55: { icon: '🌧️', desc: 'Dense Drizzle' },
    61: { icon: '🌦️', desc: 'Slight Rain' },
    63: { icon: '🌧️', desc: 'Moderate Rain' },
    65: { icon: '🌧️', desc: 'Heavy Rain' },
    71: { icon: '🌨️', desc: 'Slight Snow' },
    73: { icon: '❄️', desc: 'Moderate Snow' },
    75: { icon: '❄️', desc: 'Heavy Snow' },
    77: { icon: '🌨️', desc: 'Snow Grains' },
    80: { icon: '🌦️', desc: 'Slight Rain Showers' },
    81: { icon: '🌦️', desc: 'Rain Showers' },
    82: { icon: '⛈️', desc: 'Violent Rain' },
    85: { icon: '🌨️', desc: 'Snow Showers' },
    86: { icon: '❄️', desc: 'Heavy Snow Showers' },
    95: { icon: '⛈️', desc: 'Thunderstorm' },
    96: { icon: '⛈️', desc: 'Thunderstorm + Hail' },
    99: { icon: '⛈️', desc: 'Heavy Thunderstorm' }
};

function getWeatherInfo(code) {
    return weatherIcons[code] || { icon: '🌡️', desc: 'Unknown' };
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// === LOAD WEATHER ===
async function loadWeather() {
    try {
        const response = await fetch("/api/weather");
        if (!response.ok) throw new Error("Could not get weather data");
        const data = await response.json();
        const { location, weather, ip } = data;
        const current = weather.current;
        const daily = weather.daily;

        // Update Location
        document.getElementById("location").textContent =
            `${location.city}, ${location.region}, ${location.country}`;

        // Current Weather
        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;
        document.getElementById("feels").textContent =
            `${Math.round(current.apparent_temperature)}°C`;
        document.getElementById("humidity").textContent =
            `${Math.round(current.relative_humidity_2m)}%`;
        document.getElementById("wind").textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        // Weather Description + Icon
        const info = getWeatherInfo(current.weather_code);
        document.getElementById("weather-desc").textContent = `${info.icon} ${info.desc}`;

        // IP Address
        document.getElementById("ip").textContent = `Public IP: ${ip}`;

        // Forecast Cards
        createForecast(daily);

    } catch (err) {
        console.error(err);
        document.getElementById("location").textContent = "⚠️ Unable to load weather.";
        document.getElementById("location").classList.add("error-text");
    }
}

// === BUILD FORECAST CARDS ===
function createForecast(daily) {
    const container = document.getElementById("forecast");
    container.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {
        const info = getWeatherInfo(daily.weather_code[i]);
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <h3 class="forecast-day">${formatDate(daily.time[i])}</h3>
            <div class="forecast-icon">${info.icon}</div>
            <p class="forecast-temp">
                ${Math.round(daily.temperature_2m_max[i])}°C
                <span class="forecast-temp-min"> / ${Math.round(daily.temperature_2m_min[i])}°C</span>
            </p>
        `;
        container.appendChild(card);
    }
}

// === START ===
loadWeather();