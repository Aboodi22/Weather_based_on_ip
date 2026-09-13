async function loadWeather() {

    try {

        const response = await fetch("/api/weather");

        if (!response.ok) {
            throw new Error("Could not get weather");
        }

        const data = await response.json();

        const location = data.location;
        const current = data.weather.current;
        const daily = data.weather.daily;

        document.getElementById("location").textContent =
            `${location.city}, ${location.region}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("feels").textContent =
            `${current.apparent_temperature}°C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${current.wind_speed_10m} km/h`;

        document.getElementById("ip").textContent =
            `Public IP: ${data.ip}`;

        createForecast(daily);

    } catch (error) {

        console.error(error);

        document.getElementById("location").textContent =
            "Unable to load weather.";

    }
}


function createForecast(daily) {

    const container = document.getElementById("forecast");

    container.innerHTML = "";

    for (let i = 0; i < daily.time.length; i++) {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>${daily.time[i]}</h3>

            <p>
                Weather code:
                ${daily.weather_code[i]}
            </p>

            <p class="temperature">
                ${daily.temperature_2m_max[i]}°C
                /
                ${daily.temperature_2m_min[i]}°C
            </p>
        `;

        container.appendChild(card);
    }
}


loadWeather();